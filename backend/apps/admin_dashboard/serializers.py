from rest_framework import serializers
from .models import POLItem, Notification


# ── POL Item (Tracker + Inventory) ────────────────────────────────────────────
class POLItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = POLItem
        fields = [
            'id', 'product_name', 'part_number',
            'shelf_life', 'expiry',
            'expiry_status', 'status',
            'quantity', 'price_per_unit', 'msds_file', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class POLItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = POLItem
        fields = [
            'product_name', 'part_number',
            'shelf_life', 'expiry',
            'quantity', 'price_per_unit',
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
