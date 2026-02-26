from rest_framework import serializers
from apps.accounts.models import User
from .models import Order


# ── User Management ───────────────────────────────────────────────────────────
class UserListSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'is_active', 'created_at']


class UserToggleSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


# ── Administrator Management ──────────────────────────────────────────────────
class AdministratorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'full_name',
            'email', 'phone', 'company', 'job_title', 'role',
            'is_active', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class CreateAdministratorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, default='Admin@123')

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'company', 'job_title', 'role', 'password',
        ]

    def validate_role(self, value):
        if value not in ('admin', 'superadmin'):
            raise serializers.ValidationError('Role must be admin or superadmin.')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        if validated_data.get('role') == 'superadmin':
            user.is_staff = True
        user.save()
        return user


# ── Orders ────────────────────────────────────────────────────────────────────
class OrderListSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_name', 'product_name', 'category', 'brand',
            'phone', 'location', 'quantity', 'quantity_unit',
            'price_per_unit', 'batch_number', 'expiry', 'shelf_life',
            'status', 'is_active', 'created_at',
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class OrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['pending', 'approved', 'cancelled', 'delivered'])


class OrderToggleSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()
