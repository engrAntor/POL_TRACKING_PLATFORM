from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP, EmailVerificationToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'is_email_verified')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'company', 'job_title', 'avatar')}),
        ('Permissions', {'fields': ('role', 'is_email_verified', 'is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'purpose', 'is_verified', 'created_at', 'expires_at')
    list_filter = ('purpose', 'is_verified')
    search_fields = ('email',)


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at', 'expires_at')
    search_fields = ('user__email',)
