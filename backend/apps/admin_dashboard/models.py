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
    TYPE_CHOICES = (
        ('petroleum', 'Petroleum'),
        ('oil', 'Oil'),
        ('lubricant', 'Lubricant'),
    )
    CONDITION_CHOICES = (
        ('new_pol', 'New POL'),
        ('leftover_pol', 'Leftover POL'),
        ('opened_pol', 'Opened POL'),
    )
    UOM_CHOICES = (
        ('QT', 'Quart'),
        ('OZ', 'Ounce'),
        ('LB', 'Pound'),
        ('RL', 'Roll'),
        ('EA', 'Each'),
        ('GAL', 'Gallon'),
        ('ML', 'Millilitre'),
        ('PT', 'Pint'),
        ('KT', 'Kit'),
        ('GM', 'Gram'),
        ('FT', 'Feet'),
        ('SQ ST', 'Square Feet'),
        ('YD', 'Yard'),
        ('CC', 'Cubic Centimeter'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pol_items',
    )

    # Required fields
    part_number = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    pol_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='petroleum')
    uom = models.CharField(max_length=50, choices=UOM_CHOICES, default='GAL', help_text='Unit of Measurement')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text='Stock/Availability')
    shelf_life = models.CharField(max_length=50, help_text='e.g. 5 years')
    expiry = models.DateField()
    expiry_status = models.CharField(max_length=20, choices=EXPIRY_STATUS_CHOICES, default='active')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='new_pol')
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Auto-computed
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='healthy')

    # Optional fields
    product_name = models.CharField(max_length=200, blank=True)
    alt_part_number = models.CharField(max_length=50, blank=True)
    manufacturer_part_number = models.CharField(max_length=50, blank=True)
    mil_spec = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=50, blank=True)
    batch_number = models.CharField(max_length=50, blank=True)
    source = models.CharField(max_length=200, blank=True)
    balance = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    image = models.ImageField(upload_to='pol_images/', blank=True, null=True)
    msds_file = models.FileField(upload_to='msds/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'POL Item'
        verbose_name_plural = 'POL Items'

    def __str__(self):
        return f"{self.product_name or self.description[:50]} - {self.part_number}"


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
