from django.contrib import admin
from .models import POLItem, Notification


@admin.register(POLItem)
class POLItemAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'part_number', 'status', 'expiry', 'user')
    list_filter = ('status', 'expiry_status')
    search_fields = ('product_name', 'part_number')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_at')
    list_filter = ('status',)
