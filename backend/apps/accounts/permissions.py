from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Allow access only to users with role='admin'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsSuperAdmin(BasePermission):
    """Allow access only to users with role='superadmin'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'


class IsAdminOrSuperAdmin(BasePermission):
    """Allow access to both admin and superadmin roles."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('admin', 'superadmin')
