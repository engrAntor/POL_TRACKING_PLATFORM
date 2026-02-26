from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product_name', 'quantity', 'status', 'is_active', 'created_at')
    list_filter = ('status', 'is_active')
    search_fields = ('product_name', 'user__email')
