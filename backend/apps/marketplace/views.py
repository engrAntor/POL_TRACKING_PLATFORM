from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import IsAdmin
from apps.admin_dashboard.models import POLItem
from .models import Listing
from .serializers import ListingSerializer, ListingCreateSerializer, SellListingSerializer, InventoryForMarketSerializer


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


# ── Create Listing ────────────────────────────────────────────────────────────
class ListingCreateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ListingCreateSerializer


# ── Sell from Inventory ───────────────────────────────────────────────────────
class SellFromInventoryView(APIView):
    permission_classes = [IsAdmin]

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
            name=pol_item.product_name,
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
            quantity=pol_item.quantity,
            quantity_unit=serializer.validated_data.get('quantity_unit', 'Liter'),
            category='sell',
            status='listed',
        )

        return Response(
            ListingSerializer(listing).data,
            status=status.HTTP_201_CREATED,
        )


# ── Update Listing ────────────────────────────────────────────────────────────
class ListingUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = ListingSerializer

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
