import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()
user = User.objects.filter(role='admin', is_email_verified=True).first()
if not user:
    print("No valid admin user found")
else:
    token = str(RefreshToken.for_user(user).access_token)
    print(f"Got token for {user.email}")
    
    url = "http://127.0.0.1:8001/api/ai/tickets/"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "description": "Test issue"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(response.status_code)
        print(response.json())
    except Exception as e:
        print(e)
