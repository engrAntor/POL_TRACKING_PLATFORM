from rest_framework import serializers
from apps.admin_dashboard.models import POLItem
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='user.full_name', read_only=True)
    sds_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'seller_name', 'name', 'company', 'pol_type',
            'price', 'price_unit', 'description', 'location',
            'brand', 'batch_number', 'expiry', 'shelf_life',
            'quantity', 'quantity_unit', 'sds_file', 'sds_file_url', 'rating',
            'category', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'seller_name', 'sds_file_url', 'created_at', 'updated_at']

    def get_sds_file_url(self, obj):
        if obj.sds_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.sds_file.url)
            return obj.sds_file.url
        return None


UOM_LABELS = {
    'QT': 'Quart', 'OZ': 'Ounce', 'LB': 'Pound', 'RL': 'Roll', 'EA': 'Each',
    'GAL': 'Gallon', 'ML': 'Millilitre', 'PT': 'Pint', 'KT': 'Kit', 'GM': 'Gram',
    'FT': 'Feet', 'SQ ST': 'Square Feet', 'YD': 'Yard', 'CC': 'Cubic Centimeter',
}


class InventoryForMarketSerializer(serializers.ModelSerializer):
    """Shape POLItem data to match the Listing interface for the frontend."""
    seller_name = serializers.CharField(source='user.full_name', read_only=True)
    name = serializers.SerializerMethodField()
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

    def get_name(self, obj):
        return obj.product_name or obj.description[:100] or obj.part_number

    def get_company(self, obj):
        return ''

    def get_pol_type(self, obj):
        return obj.pol_type or 'petroleum'

    def get_price(self, obj):
        return None

    def get_price_unit(self, obj):
        uom = obj.uom or 'GAL'
        return UOM_LABELS.get(uom, uom)

    def get_description(self, obj):
        name = obj.product_name or obj.description[:100]
        return f"{name} — Part #{obj.part_number}"

    def get_location(self, obj):
        return ''

    def get_brand(self, obj):
        return ''

    def get_quantity_unit(self, obj):
        uom = obj.uom or 'GAL'
        return UOM_LABELS.get(uom, uom)

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
            'category', 'pol_item', 'sds_file',
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['status'] = 'listed'
        return super().create(validated_data)


class ListingUpdateSerializer(serializers.ModelSerializer):
    """Permissive serializer for partial PATCH updates from the frontend."""
    pol_type = serializers.ChoiceField(
        choices=[('petroleum', 'Petroleum'), ('oil', 'Oil'), ('lubricant', 'Lubricant'), ('other', 'Other')],
        required=False,
    )

    class Meta:
        model = Listing
        fields = [
            'name', 'company', 'pol_type', 'price', 'price_unit',
            'description', 'location', 'brand', 'batch_number',
            'expiry', 'shelf_life', 'quantity', 'quantity_unit',
            'sds_file', 'rating', 'category', 'status',
        ]
        extra_kwargs = {
            'name':          {'required': False, 'allow_blank': True},
            'company':       {'required': False, 'allow_blank': True},
            'location':      {'required': False, 'allow_blank': True},
            'price':         {'required': False, 'allow_null': True},
            'price_unit':    {'required': False, 'allow_blank': True},
            'description':   {'required': False, 'allow_blank': True},
            'brand':         {'required': False, 'allow_blank': True},
            'batch_number':  {'required': False, 'allow_blank': True},
            'expiry':        {'required': False, 'allow_null': True},
            'shelf_life':    {'required': False, 'allow_blank': True},
            'quantity':      {'required': False},
            'quantity_unit': {'required': False, 'allow_blank': True},
            'sds_file':      {'required': False, 'allow_null': True},
            'rating':        {'required': False, 'allow_null': True},
            'category':      {'required': False},
            'status':        {'required': False},
        }


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
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    quantity_unit = serializers.CharField(required=False)
    sds_file = serializers.FileField(required=False)
