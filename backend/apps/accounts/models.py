import random
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('superadmin', 'Super Admin'),
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    job_title = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='admin')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Extra profile fields (one-time fill)
    gst_number = models.CharField(max_length=50, blank=True)
    company_address = models.TextField(blank=True)
    delivery_address = models.TextField(blank=True)
    contact_points = models.TextField(blank=True, help_text='Contact points / key contacts')
    terms_conditions = models.TextField(blank=True, help_text='Terms & Conditions text')
    terms_conditions_file = models.FileField(upload_to='terms_conditions/', blank=True, null=True)
    delivery_terms = models.TextField(blank=True)

    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='verification_tokens',
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Verification for {self.user.email}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at


class OTP(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    purpose = models.CharField(
        max_length=20,
        choices=(('register', 'Register'), ('reset', 'Password Reset')),
        default='register',
    )
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP {self.code} for {self.email}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @staticmethod
    def generate_code():
        return str(random.randint(100000, 999999))
