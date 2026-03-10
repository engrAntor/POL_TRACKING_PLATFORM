from django.db import models
from django.conf import settings


class Listing(models.Model):
    TYPE_CHOICES = (
        ('petroleum', 'Petroleum'),
        ('oil', 'Oil'),
        ('lubricant', 'Lubricant'),
    )
    CATEGORY_CHOICES = (
        ('buy', 'Buy'),
        ('sell', 'Sell'),
    )
    STATUS_CHOICES = (
        ('listed', 'Listed'),
        ('unlisted', 'Unlisted'),
        ('sold', 'Sold'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings',
    )
    pol_item = models.ForeignKey(
        'admin_dashboard.POLItem',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='listings',
    )
    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    pol_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='petroleum')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_unit = models.CharField(max_length=20, default='Liter')
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    brand = models.CharField(max_length=100, blank=True)
    batch_number = models.CharField(max_length=50, blank=True)
    expiry = models.DateField(null=True, blank=True)
    shelf_life = models.CharField(max_length=50, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    quantity_unit = models.CharField(max_length=20, default='Liter')
    sds_file = models.FileField(upload_to='sds/', null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='sell')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='listed')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.company} ({self.category})"
