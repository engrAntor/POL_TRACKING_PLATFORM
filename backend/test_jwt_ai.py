import os
import django
import sys
import json
import urllib.request
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

user = User.objects.first()
if not user:
    print("No user found")
    sys.exit(1)

token = str(RefreshToken.for_user(user).access_token)
print("Token generated for user:", user.email)

import urllib.request
import json
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from apps.marketplace.models import Listing

# Get a test user (the one we used previously)
user = User.objects.get(email='test@admin.com') # Let's use the one we just created a ticket with
# wait, earlier we created a ticket with test@admin.com but used dijkstra120917@gmail.com's token.
# Let's just use dijkstra120917@gmail.com
user = User.objects.get(email='dijkstra120917@gmail.com')

token = str(RefreshToken.for_user(user).access_token)
print("Token generated for user:", user.email)

# Find the ticket we created earlier
from POL_AI.pol_ai.models import SupportTicket # wait, the app is not in INSTALLED_APPS for the backend. We'll just hardcode TKT-0003 or find it via API.


try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error Status:", e.code)
    html = e.read().decode('utf-8')
    with open('error.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Saved error.html")
except urllib.error.URLError as e:
    print("URL Error:", str(e))
