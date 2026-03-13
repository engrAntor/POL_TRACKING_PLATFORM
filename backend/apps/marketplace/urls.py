from django.urls import path
from . import views

urlpatterns = [
    # Browse listings
    path('listings/', views.ListingListView.as_view(), name='listing-list'),
    path('listings/my/', views.MyListingsView.as_view(), name='my-listings'),
    path('listings/inventory/', views.MyInventoryView.as_view(), name='my-inventory'),
    path('listings/<int:pk>/', views.ListingDetailView.as_view(), name='listing-detail'),

    # Create / Sell
    path('listings/create/', views.ListingCreateView.as_view(), name='listing-create'),
    path('listings/sell/', views.SellFromInventoryView.as_view(), name='sell-from-inventory'),

    # Update / Remove / Delete
    path('listings/<int:pk>/update/', views.ListingUpdateView.as_view(), name='listing-update'),
    path('listings/<int:pk>/remove/', views.ListingRemoveView.as_view(), name='listing-remove'),
    path('listings/<int:pk>/delete/', views.ListingDeleteView.as_view(), name='listing-delete'),

    # Stripe Checkout & Webhook
    path('checkout/', views.CreateCheckoutSessionView.as_view(), name='create-checkout'),
    path('verify-payment/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('webhook/', views.StripeWebhookView.as_view(), name='stripe-webhook'),
]
