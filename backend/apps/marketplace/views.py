import stripe
from django.conf import settings as django_settings

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import IsAdmin
from apps.admin_dashboard.models import POLItem
from apps.superadmin.models import Order
from .models import Listing
from .serializers import ListingSerializer, ListingCreateSerializer, SellListingSerializer, InventoryForMarketSerializer, ListingUpdateSerializer

stripe.api_key = django_settings.STRIPE_SECRET_KEY


# ── Marketplace Listings (Browse) ─────────────────────────────────────────────
class ListingListView(generics.ListAPIView):
    """All listed items from OTHER users (for buying)."""
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer
    pagination_class = None
    filterset_fields = ['pol_type', 'category', 'status', 'location']
    search_fields = ['name', 'company', 'brand', 'description']
    ordering_fields = ['price', 'created_at', 'rating']

    def get_queryset(self):
        qs = Listing.objects.select_related('user').filter(status='listed')
        # Exclude current user's own listings
        if self.request.user.is_authenticated:
            qs = qs.exclude(user=self.request.user)
        listing_type = self.request.GET.get('listing_type')
        if listing_type in ('buy', 'sell'):
            qs = qs.filter(category=listing_type)
        return qs


# ── My Listings (User's own) ─────────────────────────────────────────────────
class MyListingsView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ListingSerializer
    pagination_class = None

    def get_queryset(self):
        return Listing.objects.filter(user=self.request.user, status='listed')


# ── My Inventory (POLItems not yet listed) ───────────────────────────────────
class MyInventoryView(generics.ListAPIView):
    """Return user's POL items that are NOT already listed in the marketplace."""
    permission_classes = [IsAdmin]
    serializer_class = InventoryForMarketSerializer
    pagination_class = None

    def get_queryset(self):
        listed_pol_ids = Listing.objects.filter(
            user=self.request.user, status='listed',
        ).values_list('pol_item_id', flat=True)
        return POLItem.objects.filter(
            user=self.request.user,
        ).exclude(pk__in=listed_pol_ids)


# ── Listing Detail ────────────────────────────────────────────────────────────
class ListingDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ListingSerializer
    queryset = Listing.objects.select_related('user').all()

    def get_serializer_context(self):
        return {**super().get_serializer_context(), 'request': self.request}


# ── Create Listing ────────────────────────────────────────────────────────────
class ListingCreateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ListingCreateSerializer

    def create(self, request, *args, **kwargs):
        if not getattr(request.user, 'stripe_onboarding_complete', False):
            return Response(
                {'error': 'seller_stripe_not_connected'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().create(request, *args, **kwargs)


# ── Sell from Inventory ───────────────────────────────────────────────────────
class SellFromInventoryView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        # Guard: seller must have completed Stripe onboarding
        if not getattr(request.user, 'stripe_onboarding_complete', False):
            return Response(
                {'error': 'seller_stripe_not_connected'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = SellListingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            pol_item = POLItem.objects.get(
                pk=serializer.validated_data['pol_item_id'],
                user=request.user,
            )
        except POLItem.DoesNotExist:
            return Response(
                {'error': 'Inventory item not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if already listed
        already = Listing.objects.filter(pol_item=pol_item, status='listed').exists()
        if already:
            return Response(
                {'error': 'This item is already listed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        listing = Listing.objects.create(
            user=request.user,
            pol_item=pol_item,
            name=pol_item.product_name or (pol_item.description or '')[:200] or pol_item.part_number,
            company=serializer.validated_data.get('company', ''),
            pol_type=serializer.validated_data.get('pol_type', 'petroleum'),
            price=serializer.validated_data['price'],
            price_unit=serializer.validated_data.get('price_unit', 'Liter'),
            description=serializer.validated_data.get('description', ''),
            location=serializer.validated_data.get('location', ''),
            brand=serializer.validated_data.get('brand', ''),
            batch_number=pol_item.part_number,
            expiry=pol_item.expiry,
            shelf_life=pol_item.shelf_life,
            quantity=serializer.validated_data.get('quantity', pol_item.quantity),
            quantity_unit=serializer.validated_data.get('quantity_unit', 'Liter'),
            category='sell',
            status='listed',
            sds_file=serializer.validated_data.get('sds_file'),
        )

        return Response(
            ListingSerializer(listing, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


# ── Update Listing ────────────────────────────────────────────────────────────
class ListingUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ListingUpdateSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Listing.objects.filter(user=self.request.user)


# ── Remove Listing (set unlisted) ─────────────────────────────────────────────
class ListingRemoveView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            listing = Listing.objects.get(pk=pk, user=request.user)
        except Listing.DoesNotExist:
            return Response({'error': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        listing.status = 'unlisted'
        listing.save()
        return Response({'message': 'Listing removed from marketplace.'})


# ── Delete Listing ────────────────────────────────────────────────────────────
class ListingDeleteView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            listing = Listing.objects.get(pk=pk, user=request.user)
        except Listing.DoesNotExist:
            return Response({'error': 'Listing not found.'}, status=status.HTTP_404_NOT_FOUND)

        listing.delete()
        return Response({'message': 'Listing deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ── Stripe Checkout ──────────────────────────────────────────────────────────
class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Guard: buyer must have completed Stripe onboarding
        if not getattr(request.user, 'stripe_onboarding_complete', False):
            return Response(
                {'error': 'buyer_stripe_not_connected'},
                status=status.HTTP_403_FORBIDDEN,
            )

        listing_id = request.data.get('listing_id')
        buyer_qty = request.data.get('quantity')

        try:
            listing = Listing.objects.get(pk=listing_id, status='listed')
        except Listing.DoesNotExist:
            return Response(
                {'error': 'Listing not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not listing.price:
            return Response(
                {'error': 'This listing has no price set.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            buyer_qty = float(buyer_qty)
        except (TypeError, ValueError):
            buyer_qty = float(listing.quantity)

        # Total = price_per_unit * requested quantity
        total_cents = int(float(listing.price) * buyer_qty * 100)

        frontend_url = django_settings.FRONTEND_URL

        try:
            qty_display = int(buyer_qty) if buyer_qty % 1 == 0 else buyer_qty
            
            # Ensure name and description fit within Stripe constraints
            name_str = (listing.name or 'Unknown Product')[:250]
            desc_str = f'{listing.pol_type.capitalize()} - {listing.company} | Qty: {qty_display} {listing.quantity_unit}'[:500]
            
            # Calculate the Platform Commission dynamically
            seller = listing.user
            commission_rate = 0.30  # Default to Basic
            
            seller_tier = getattr(seller, 'subscription_tier', 'basic')
            if seller_tier == 'premium':
                commission_rate = 0.10
            elif seller_tier == 'business':
                commission_rate = 0.20
            
            # application_fee_amount is in cents
            platform_fee_cents = int(total_cents * commission_rate)

            # Define checkout session args
            session_kwargs = {
                'payment_method_types': ['card'],
                'line_items': [{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': name_str,
                            'description': desc_str,
                        },
                        'unit_amount': total_cents,
                    },
                    'quantity': 1,
                }],
                'mode': 'payment',
                'success_url': f'{frontend_url}/marketplace?payment=success&session_id={{CHECKOUT_SESSION_ID}}',
                'cancel_url': f'{frontend_url}/marketplace?payment=cancelled',
                'metadata': {
                    'listing_id': str(listing.id),
                    'buyer_id': str(request.user.id),
                    'quantity': str(buyer_qty),
                },
            }

            # Add Destination Charge data linking to the Seller's Express Account
            if getattr(seller, 'stripe_onboarding_complete', False) and getattr(seller, 'stripe_account_id', None):
                session_kwargs['payment_intent_data'] = {
                    'application_fee_amount': platform_fee_cents,
                    'transfer_data': {
                        'destination': seller.stripe_account_id,
                    },
                }

            session = stripe.checkout.Session.create(**session_kwargs)
            return Response({'checkout_url': session.url})
        except stripe.error.StripeError as e:
            print("Stripe Error:", str(e))
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ── Verify Payment (for local dev / success redirect) ─────────────────────────
class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'session_id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            session = stripe.checkout.Session.retrieve(session_id)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if session.payment_status != 'paid':
            return Response({'error': 'Payment not completed'}, status=status.HTTP_400_BAD_REQUEST)
        listing_id = session.metadata.get('listing_id')
        if not listing_id:
            return Response({'error': 'No listing in session'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            listing = Listing.objects.select_related('pol_item').get(id=listing_id)

            # 1. Mark listing as sold (removes it from seller's My Listings)
            already_sold = listing.status == 'sold'
            if not already_sold:
                listing.status = 'sold'
                listing.save()

            # 2. Add purchased product to buyer's inventory (POLItem)
            if not already_sold:
                buyer = request.user
                pol = listing.pol_item
                import datetime
                
                # Fetch details before deleting
                seller_pol = pol
                part_num = pol.part_number if pol else listing.batch_number or 'MP-001'
                uom = pol.uom if pol else 'GAL'
                shelf_life = pol.shelf_life if pol else 'N/A'
                expiry_date = pol.expiry if pol else datetime.date.today()
                
                POLItem.objects.create(
                    user=buyer,
                    part_number=part_num,
                    description=listing.description or listing.name,
                    pol_type=listing.pol_type or 'petroleum',
                    uom=uom,
                    quantity=listing.quantity or 1,
                    shelf_life=shelf_life,
                    expiry=expiry_date,
                    expiry_status='active',
                    condition='new_pol',
                    price_per_unit=listing.price or 0,
                    product_name=listing.name,
                    batch_number=listing.batch_number or '',
                    source=f'Purchased from marketplace (listing #{listing.id})',
                )
                
                # 3. Remove the original POLItem from the seller's usage tracker
                if seller_pol:
                    seller_pol.delete()

                # 4. Create Order record for SuperAdmin dashboard
                seller = listing.user
                commission_rate = 0.30  # Default: Basic tier
                seller_tier = getattr(seller, 'subscription_tier', 'basic')
                if seller_tier == 'premium':
                    commission_rate = 0.10
                elif seller_tier == 'business':
                    commission_rate = 0.20

                qty = float(listing.quantity) if listing.quantity else 1
                total_price = float(listing.price or 0) * qty
                platform_commission = total_price * commission_rate

                Order.objects.get_or_create(
                    listing=listing,
                    user=buyer,
                    defaults=dict(
                        seller=seller,
                        product_name=listing.name,
                        category=listing.pol_type.capitalize(),
                        brand=listing.company,
                        phone=getattr(buyer, 'phone_number', ''),
                        location=listing.location,
                        quantity=qty,
                        quantity_unit=listing.quantity_unit,
                        price_per_unit=listing.price or 0,
                        total_price=total_price,
                        platform_commission=platform_commission,
                        batch_number=listing.batch_number or '',
                        expiry=listing.expiry,
                        shelf_life=listing.shelf_life,
                        status='approved',
                    )
                )

            return Response({'status': 'sold', 'listing_id': listing.id})
        except Listing.DoesNotExist:
            return Response({'error': 'Listing not found'}, status=status.HTTP_404_NOT_FOUND)


# ── Stripe Webhook ────────────────────────────────────────────────────────────
class StripeWebhookView(APIView):
    """
    Handles Stripe webhooks (e.g., checkout.session.completed).
    We use this to mark the order as paid, deduct quantity from inventory,
    calculate the platform commission, and record the Order for SuperAdmin.
    """
    permission_classes = []  # Stripe sends these requests anonymously

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        # IMPORTANT: in production, set STRIPE_WEBHOOK_SECRET in .env
        endpoint_secret = getattr(django_settings, 'STRIPE_WEBHOOK_SECRET', None)

        try:
            if endpoint_secret:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, endpoint_secret
                )
            else:
                # If no secret is provided (local testing without strict webhook verification), just parse it
                import json
                event = stripe.Event.construct_from(json.loads(payload), stripe.api_key)
        except ValueError as e:
            return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            # Extract our custom metadata passed when creating the session
            metadata = session.get('metadata', {})
            listing_id = metadata.get('listing_id')
            buyer_id = metadata.get('buyer_id')
            quantity_str = metadata.get('quantity')

            if not all([listing_id, buyer_id, quantity_str]):
                # Could be a subscription checkout (handled elsewhere) or missing metadata
                return Response({'status': 'ignored: missing marketplace metadata'})

            try:
                listing = Listing.objects.get(pk=listing_id)
                buyer = django_settings.AUTH_USER_MODEL.objects.get(pk=buyer_id) if hasattr(django_settings.AUTH_USER_MODEL, 'objects') else None
                # If we're using custom user model:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                buyer = User.objects.get(pk=buyer_id)
                buyer_qty = float(quantity_str)
            except Exception as e:
                print("Webhook processing error:", e)
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            # Determine Seller's platform commission based on tier
            seller = listing.user
            commission_rate = 0.30  # Default to Basic
            
            # Use getattr to safely check subscription_tier
            seller_tier = getattr(seller, 'subscription_tier', 'basic')
            if seller_tier == 'premium':
                commission_rate = 0.10
            elif seller_tier == 'business':
                commission_rate = 0.20
            
            total_price = float(listing.price) * buyer_qty
            platform_commission = total_price * commission_rate

            # Construct the descriptive order record.
            # Use get_or_create so that if VerifyPaymentView already processed
            # this payment (frontend redirect), the webhook does not create a
            # second Order for the same listing + buyer.
            _, created = Order.objects.get_or_create(
                listing=listing,
                user=buyer,
                defaults=dict(
                    seller=seller,
                    product_name=listing.name,
                    category=listing.pol_type.capitalize(),
                    brand=listing.company,
                    phone=getattr(buyer, 'phone_number', ''),
                    location=listing.location,
                    quantity=buyer_qty,
                    quantity_unit=listing.quantity_unit,
                    price_per_unit=listing.price,
                    total_price=total_price,
                    platform_commission=platform_commission,
                    batch_number=listing.batch_number,
                    expiry=listing.expiry,
                    shelf_life=listing.shelf_life,
                    status='approved',
                ),
            )

            # Only deduct inventory when this webhook created the order.
            # If created=False, VerifyPaymentView already handled everything.
            if created:
                listing.quantity = float(listing.quantity) - buyer_qty
                if listing.quantity <= 0:
                    listing.status = 'sold'
                    listing.quantity = 0
                listing.save()

                if listing.pol_item:
                    pol_item = listing.pol_item
                    try:
                        pol_qty = float(pol_item.quantity) - buyer_qty
                        pol_item.quantity = max(0.0, pol_qty)
                        pol_item.save()
                    except (ValueError, TypeError):
                        pass

        return Response({'status': 'success'})
