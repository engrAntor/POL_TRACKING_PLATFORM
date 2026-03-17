import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pol_ai.models import POLItem, Listing

print(f"POLItems in Main DB: {POLItem.objects.count()}")
print(f"Listings in Main DB: {Listing.objects.count()}")
