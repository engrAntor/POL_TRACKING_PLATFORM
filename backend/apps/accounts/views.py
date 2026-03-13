from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import stripe

from .models import User, OTP, EmailVerificationToken
from .tasks import send_verification_email, send_otp_email
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer,
)


# ── Register ──────────────────────────────────────────────────────────────────
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create verification token
        token = EmailVerificationToken.objects.create(
            user=user,
            expires_at=timezone.now() + timedelta(hours=24),
        )

        # Build verification link
        frontend_url = settings.FRONTEND_URL
        verify_link = f"{frontend_url}/verify-email?token={token.token}"

        # Send verification email via Celery
        send_verification_email.delay(user.email, user.first_name, verify_link)

        return Response({
            'message': 'Registration successful. Please check your email to verify your account.',
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


# ── Verify Email ──────────────────────────────────────────────────────────────
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token_str = request.GET.get('token')
        if not token_str:
            return Response(
                {'error': 'Verification token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = EmailVerificationToken.objects.get(token=token_str)
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {'error': 'Invalid verification link.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if token.is_expired:
            return Response(
                {'error': 'Verification link has expired. Please register again.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify the user
        user = token.user
        user.is_email_verified = True
        user.save()

        # Clean up token
        token.delete()

        # Return tokens so user is logged in after verification
        tokens = RefreshToken.for_user(user)
        return Response({
            'message': 'Email verified successfully. You can now login.',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            },
        })


# ── Resend Verification Email ─────────────────────────────────────────────────
class ResendVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'No account found with this email.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user.is_email_verified:
            return Response({'message': 'Email is already verified.'})

        # Delete old tokens
        EmailVerificationToken.objects.filter(user=user).delete()

        # Create new token
        token = EmailVerificationToken.objects.create(
            user=user,
            expires_at=timezone.now() + timedelta(hours=24),
        )

        frontend_url = settings.FRONTEND_URL
        verify_link = f"{frontend_url}/verify-email?token={token.token}"

        # Send verification email via Celery
        send_verification_email.delay(user.email, user.first_name, verify_link)

        return Response({
            'message': f'Verification email resent to {email}.',
        })


# ── Login (Admin) ────────────────────────────────────────────────────────────
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if user.role != 'admin':
            return Response(
                {'error': 'Use the super admin login page.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not user.is_email_verified:
            return Response(
                {'error': 'Please verify your email before logging in. Check your inbox.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            },
        })


# ── Login (Super Admin) ──────────────────────────────────────────────────────
class SuperAdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if user.role != 'superadmin':
            return Response(
                {'error': 'You are not authorized as Super Admin.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = RefreshToken.for_user(user)
        return Response({
            'message': 'Super Admin login successful.',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            },
        })


# ── Google Login ─────────────────────────────────────────────────────────────
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('credential')
        if not token:
            return Response(
                {'error': 'Google credential token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )
        except ValueError:
            return Response(
                {'error': 'Invalid Google token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'role': 'admin',
                'is_email_verified': True,
            },
        )

        if created:
            user.set_unusable_password()
            user.save()

        if user.role != 'admin':
            return Response(
                {'error': 'Use the super admin login page.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = RefreshToken.for_user(user)
        return Response({
            'message': 'Google login successful.',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            },
        })


# ── Logout ────────────────────────────────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'})
        except Exception:
            return Response(
                {'error': 'Invalid token.'},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ── Profile (Get & Update) ───────────────────────────────────────────────────
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user


# ── Change Password ──────────────────────────────────────────────────────────
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'message': 'Password changed successfully.'})


# ── Send OTP ──────────────────────────────────────────────────────────────────
class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        purpose = serializer.validated_data['purpose']

        # For password reset, check if user exists
        if purpose == 'reset' and not User.objects.filter(email=email).exists():
            return Response(
                {'error': 'No account found with this email.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Invalidate previous OTPs for this email/purpose
        OTP.objects.filter(email=email, purpose=purpose, is_verified=False).delete()

        # Create new OTP
        code = OTP.generate_code()
        OTP.objects.create(
            email=email,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES),
        )

        # Send OTP via Celery
        send_otp_email.delay(email, code, purpose)

        return Response({
            'message': f'OTP sent to {email}.',
        })


# ── Verify OTP ────────────────────────────────────────────────────────────────
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        purpose = serializer.validated_data['purpose']

        otp = OTP.objects.filter(
            email=email, code=code, purpose=purpose, is_verified=False
        ).first()

        if not otp:
            return Response(
                {'error': 'Invalid OTP code.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if otp.is_expired:
            return Response(
                {'error': 'OTP has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp.is_verified = True
        otp.save()
        return Response({'message': 'OTP verified successfully.'})


# ── Reset Password ────────────────────────────────────────────────────────────
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        code = serializer.validated_data['code']

        # Verify OTP is valid and verified
        otp = OTP.objects.filter(
            email=email, code=code, purpose='reset', is_verified=True
        ).first()

        if not otp:
            return Response(
                {'error': 'OTP not verified. Please verify OTP first.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'No account found with this email.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        # Clean up used OTP
        otp.delete()

        return Response({'message': 'Password reset successful.'})


# ── Token Refresh ────────────────────────────────────────────────────────────
class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            return Response({
                'access': str(token.access_token),
                'refresh': str(token),
            })
        except Exception:
            return Response(
                {'error': 'Invalid or expired refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# ── Subscription Checkout ────────────────────────────────────────────────────
stripe.api_key = settings.STRIPE_SECRET_KEY

class SubscriptionCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        tier_id = request.data.get('tier_id')
        
        # Define prices manually (or retrieve from Stripe Products in a real scenario)
        tier_prices = {
            'basic': 29,
            'business': 99,
            'premium': 299,
        }
        
        if tier_id not in tier_prices:
            return Response(
                {'error': 'Invalid subscription tier.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        frontend_url = settings.FRONTEND_URL
        price_cents = tier_prices[tier_id] * 100

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': f'POL Tracking - {tier_id.capitalize()} Tier',
                            'description': f'Monthly subscription for {tier_id.capitalize()} tier',
                        },
                        'unit_amount': price_cents,
                        # Set recurring to true for actual subscriptions, or leave unit_amount for 1-time testing
                        # 'recurring': {'interval': 'month'}
                    },
                    'quantity': 1,
                }],
                # use 'subscription' mode if recurring
                mode='payment', 
                success_url=f'{frontend_url}/subscription?payment=success&tier={tier_id}',
                cancel_url=f'{frontend_url}/subscription?payment=cancelled',
                metadata={
                    'user_id': str(request.user.id),
                    'tier_id': tier_id,
                    'type': 'subscription_upgrade'
                },
            )
            return Response({'checkout_url': session.url})
        except stripe.error.StripeError as e:
            print("Stripe Error (Subscription):", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ── Stripe Connect Onboarding ────────────────────────────────────────────────
class StripeConnectLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        frontend_url = settings.FRONTEND_URL

        # 1. Ensure user has a stripe_account_id
        if not user.stripe_account_id:
            try:
                account = stripe.Account.create(
                    type='express',
                    email=user.email,
                )
                user.stripe_account_id = account.id
                user.save()
            except Exception as e:
                err_msg = getattr(e, 'user_message', str(e))
                print("Stripe Account.create error:", repr(e))
                return Response({'error': err_msg}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Generate AccountLink URL
        try:
            account_link = stripe.AccountLink.create(
                account=user.stripe_account_id,
                refresh_url=f"{frontend_url}/stripe-return?refresh=true",
                return_url=f"{frontend_url}/stripe-return?success=true",
                type="account_onboarding",
            )
            return Response({'url': account_link.url})
        except Exception as e:
            err_msg = getattr(e, 'user_message', str(e))
            print("Stripe AccountLink.create error:", repr(e))
            return Response({'error': err_msg}, status=status.HTTP_400_BAD_REQUEST)


class StripeConnectVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.stripe_account_id:
            return Response({'error': 'No Stripe account linked.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = stripe.Account.retrieve(user.stripe_account_id)
            if account.details_submitted and account.charges_enabled and account.payouts_enabled:
                user.stripe_onboarding_complete = True
                user.save()
                return Response({'status': 'complete', 'message': 'Stripe onboarding successful.'})
            else:
                user.stripe_onboarding_complete = False
                user.save()
                return Response({'status': 'incomplete', 'message': 'Stripe onboarding is incomplete.'})
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
