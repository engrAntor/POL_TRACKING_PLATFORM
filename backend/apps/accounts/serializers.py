from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, OTP


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'phone',
            'company', 'job_title',
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is deactivated.')
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'company', 'job_title', 'role', 'avatar',
            'is_email_verified', 'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_email_verified', 'created_at', 'updated_at']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': 'Passwords do not match.'})
        return data


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=['register', 'reset'], default='reset')


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=['register', 'reset'], default='reset')


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': 'Passwords do not match.'})
        return data
