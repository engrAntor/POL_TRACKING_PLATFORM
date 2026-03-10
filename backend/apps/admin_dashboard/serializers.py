from rest_framework import serializers
from .models import POLItem, Notification


# ── POL Item (Tracker + Inventory) ────────────────────────────────────────────
class POLItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = POLItem
        fields = [
            'id',
            # Required
            'part_number', 'description', 'pol_type', 'uom',
            'quantity', 'shelf_life', 'expiry', 'expiry_status',
            'condition', 'price_per_unit', 'status',
            # Optional
            'product_name', 'alt_part_number', 'manufacturer_part_number',
            'mil_spec', 'serial_number', 'batch_number',
            'source', 'balance', 'notes',
            'image', 'msds_file', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class POLItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = POLItem
        fields = [
            # Required
            'part_number', 'description', 'pol_type', 'uom',
            'quantity', 'shelf_life', 'expiry', 'condition', 'price_per_unit',
            # Optional
            'product_name', 'alt_part_number', 'manufacturer_part_number',
            'mil_spec', 'serial_number', 'batch_number',
            'source', 'balance', 'notes',
            'image',
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# ── Notification ──────────────────────────────────────────────────────────────
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
