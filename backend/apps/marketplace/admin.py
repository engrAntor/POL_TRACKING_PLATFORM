from django.contrib import admin
from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'pol_type', 'category', 'status', 'price', 'user')
    list_filter = ('pol_type', 'category', 'status')
    search_fields = ('name', 'company', 'brand')
