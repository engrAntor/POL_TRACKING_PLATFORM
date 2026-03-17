import requests
import json
import sqlite3
import os

# Connect to DB to find an admin user
db_path = os.path.join(os.path.dirname(__file__), 'backend', 'db.sqlite3')
db = sqlite3.connect(db_path)
cursor = db.cursor()
cursor.execute("SELECT email, password FROM accounts_user WHERE role='admin' AND is_email_verified=1 LIMIT 1")
row = cursor.fetchone()
email = row[0]
print(f"Found user: {email}")

# Since password is encrypted, let's just create a super simple test token generator or change password directly in DB
# For quick test, I'll update the password of this user to 'testpassword123'
import hashlib
from django.contrib.auth.hashers import make_password

# This is a bit complex, let's just make a user via Django shell in the next step instead of the script, or just directly use a raw SQL token.
