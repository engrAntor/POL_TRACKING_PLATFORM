from rest_framework import serializers
from apps.admin_dashboard.models import POLItem
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'seller_name', 'name', 'company', 'pol_type',
            'price', 'price_unit', 'description', 'location',
            'brand', 'batch_number', 'expiry', 'shelf_life',
            'quantity', 'quantity_unit', 'rating',
            'category', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'seller_name', 'created_at', 'updated_at']


class InventoryForMarketSerializer(serializers.ModelSerializer):
    """Shape POLItem data to match the Listing interface for the frontend."""
    seller_name = serializers.CharField(source='user.full_name', read_only=True)
    name = serializers.CharField(source='product_name')
    company = serializers.SerializerMethodField()
    pol_type = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    price_unit = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()
    batch_number = serializers.CharField(source='part_number')
    quantity_unit = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    is_inventory = serializers.SerializerMethodField()

    class Meta:
        model = POLItem
        fields = [
            'id', 'seller_name', 'name', 'company', 'pol_type',
            'price', 'price_unit', 'description', 'location',
            'brand', 'batch_number', 'expiry', 'shelf_life',
            'quantity', 'quantity_unit', 'rating',
            'category', 'status', 'created_at', 'is_inventory',
        ]

    def get_company(self, obj):
        return ''

    def get_pol_type(self, obj):
        return 'petroleum'

    def get_price(self, obj):
        return None

    def get_price_unit(self, obj):
        return 'Liter'

    def get_description(self, obj):
        return f"{obj.product_name} — Part #{obj.part_number}"

    def get_location(self, obj):
        return ''

    def get_brand(self, obj):
        return ''

    def get_quantity_unit(self, obj):
        return 'Units'

    def get_rating(self, obj):
        return None

    def get_category(self, obj):
        return 'sell'

    def get_status(self, obj):
        return 'inventory'

    def get_is_inventory(self, obj):
        return True


class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'name', 'company', 'pol_type', 'price', 'price_unit',
            'description', 'location', 'brand', 'batch_number',
            'expiry', 'shelf_life', 'quantity', 'quantity_unit',
            'category', 'pol_item',
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['status'] = 'listed'
        return super().create(validated_data)


class SellListingSerializer(serializers.Serializer):
    """Create a sell listing from an existing inventory item."""
    pol_item_id = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    description = serializers.CharField(required=False, allow_blank=True)
    company = serializers.CharField(required=False, allow_blank=True)
    pol_type = serializers.CharField(required=False)
    price_unit = serializers.CharField(required=False)
    location = serializers.CharField(required=False, allow_blank=True)
    brand = serializers.CharField(required=False, allow_blank=True)
    quantity_unit = serializers.CharField(required=False)
