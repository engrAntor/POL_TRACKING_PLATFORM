import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pol_ai.authentication import CustomJWTAuthentication

auth = CustomJWTAuthentication()
try:
    user = auth.get_user({'user_id': 1})
    print("User found:", getattr(user, 'email', None))
except Exception as e:
    import traceback
    traceback.print_exc()
