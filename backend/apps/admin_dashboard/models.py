from django.db import models
from django.conf import settings


class POLItem(models.Model):
    STATUS_CHOICES = (
        ('healthy', 'Healthy'),
        ('expired', 'Expired'),
        ('low_stock', 'Low Stock'),
    )
    EXPIRY_STATUS_CHOICES = (
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('near_expiry', 'Near Expiry'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pol_items',
    )
    product_name = models.CharField(max_length=200)
    part_number = models.CharField(max_length=50)
    shelf_life = models.CharField(max_length=50, help_text='e.g. 5 years')
    expiry = models.DateField()
    expiry_status = models.CharField(max_length=20, choices=EXPIRY_STATUS_CHOICES, default='active')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='healthy')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    msds_file = models.FileField(upload_to='msds/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'POL Item'
        verbose_name_plural = 'POL Items'

    def __str__(self):
        return f"{self.product_name} - {self.part_number}"


class Notification(models.Model):
    STATUS_CHOICES = (
        ('alert', 'Alert'),
        ('pending', 'Pending'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title = models.CharField(max_length=300)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='alert')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
