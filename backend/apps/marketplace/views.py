import stripe
from django.conf import settings as django_settings

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import IsAdmin
from apps.admin_dashboard.models import POLItem
from .models import Listing
from .serializers import ListingSerializer, ListingCreateSerializer, SellListingSerializer, InventoryForMarketSerializer

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


# ── Sell from Inventory ───────────────────────────────────────────────────────
class SellFromInventoryView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
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
            name=pol_item.product_name or pol_item.description[:200] or pol_item.part_number,
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
    serializer_class = ListingSerializer
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
        listing_id = request.data.get('listing_id')

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

        # Total = price_per_unit * seller's listed quantity
        total_cents = int(float(listing.price) * float(listing.quantity) * 100)

        frontend_url = django_settings.FRONTEND_URL

        try:
            qty_display = int(listing.quantity) if float(listing.quantity) % 1 == 0 else listing.quantity
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': listing.name,
                            'description': f'{listing.pol_type.capitalize()} - {listing.company} | Qty: {qty_display} {listing.quantity_unit}',
                        },
                        'unit_amount': total_cents,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'{frontend_url}/marketplace?payment=success',
                cancel_url=f'{frontend_url}/marketplace?payment=cancelled',
                metadata={
                    'listing_id': str(listing.id),
                    'buyer_id': str(request.user.id),
                },
            )
            return Response({'checkout_url': session.url})
        except stripe.error.StripeError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
