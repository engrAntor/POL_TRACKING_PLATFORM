from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('register/', views.RegisterView.as_view(), name='register'),
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification/', views.ResendVerificationView.as_view(), name='resend-verification'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('superadmin-login/', views.SuperAdminLoginView.as_view(), name='superadmin-login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),

    # Profile
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),

    # OTP & Password Reset
    path('send-otp/', views.SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
]
