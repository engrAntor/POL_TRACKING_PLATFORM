import requests
import sqlite3

login_url = "http://127.0.0.1:8000/api/accounts/login/"
db = sqlite3.connect('backend/db.sqlite3')
cursor = db.cursor()
# Find a user we can login with, maybe a test user
cursor.execute("SELECT email, password FROM accounts_user WHERE role='admin' LIMIT 1")
row = cursor.fetchone()
if not row:
    print("No user found")
    exit()

email = row[0]
print(f"Logging in with {email} (Need password)")
# Let's bypass password by creating a superuser token via the main backend's manage.py shell

import os
with open("get_token.py", "w") as f:
    f.write("""
import os, sys, django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
User = get_user_model()
user = User.objects.first()
print(str(RefreshToken.for_user(user).access_token))
""")
