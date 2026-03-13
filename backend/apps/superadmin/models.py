from django.db import models
from django.conf import settings


class SuperAdminNotification(models.Model):
    TYPE_CHOICES = (
        ('new_order', 'New Order Placed'),
        ('new_user', 'New User Registered'),
        ('new_issue', 'New User Issue'),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_type_display()} — {self.title}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sales',
        null=True, blank=True,
    )
    listing = models.ForeignKey(
        'marketplace.Listing',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='orders',
    )
    product_name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, default='Petroleum')
    brand = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=200)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_unit = models.CharField(max_length=20, default='liter')
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    platform_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    batch_number = models.CharField(max_length=50, blank=True)
    expiry = models.DateField(null=True, blank=True)
    shelf_life = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.product_name} by {self.user.full_name}"
