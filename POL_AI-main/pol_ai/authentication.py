from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.db import connection

class MockUser:
    """
    A lightweight mock user object that satisfies the AI backend's 
    requirements for user properties without needing the full ORM model.
    """
    def __init__(self, id, email):
        self.id = id
        self.pk = id  # DRF throttling uses request.user.pk
        self.email = email
        self.is_authenticated = True

class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that bypasses Django's default User model lookup.
    Instead, it queries the shared database's `accounts_user` table directly 
    using raw SQL to find the active user matching the token's ID.
    This prevents 401 Unauthorized errors when the token ID does not exist 
    in the default auth_user table.
    """
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        if not user_id:
            raise AuthenticationFailed("Token contained no recognizable user identification")
        
        with connection.cursor() as cursor:
            # We use %s here as Django's standard parameter substitution, 
            # though some SQLite adapters prefer ?. Using format to build string
            # to be completely safe across all Django DB engines, or using standard driver binding.
            # Usually sqlite3 cursor in Django prefers %s (Django abstraction)
            # but standard sqlite3 uses ?. Let's use %s as it's Django's standard for execute().
            try:
                cursor.execute("SELECT id, email, is_active FROM accounts_user WHERE id = %s", [user_id])
            except Exception:
                # Fallback to ? if %s fails for raw sqlite3 connection
                cursor.execute("SELECT id, email, is_active FROM accounts_user WHERE id = ?", [user_id])

            row = cursor.fetchone()
            
            if not row:
                raise AuthenticationFailed("User not found in accounts_user table", code="user_not_found")
                
            user_db_id, email, is_active = row
            
            if not is_active:
                raise AuthenticationFailed("User is inactive", code="user_inactive")
                
            return MockUser(id=user_db_id, email=email)
