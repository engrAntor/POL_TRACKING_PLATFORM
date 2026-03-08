from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.accounts.models import User
from apps.accounts.permissions import IsSuperAdmin
from .models import Order, SuperAdminNotification
from .serializers import (
    UserListSerializer, UserToggleSerializer,
    AdministratorSerializer, CreateAdministratorSerializer,
    OrderListSerializer, OrderDetailSerializer, OrderStatusSerializer, OrderToggleSerializer,
    SuperAdminNotificationSerializer,
)


# ══════════════════════════════════════════════════════════════════════════════
# OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
class OverviewView(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        total_users = User.objects.filter(role='admin').count()
        today_new = User.objects.filter(
            role='admin',
            created_at__date=request.GET.get('date', None) or __import__('django.utils', fromlist=['timezone']).timezone.now().date()
        ).count()

        # Monthly user activity (registrations per month for selected year)
        year = request.GET.get('year', __import__('django.utils', fromlist=['timezone']).timezone.now().year)
        monthly = (
            User.objects.filter(role='admin', created_at__year=year)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        monthly_data = []
        month_names = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        month_map = {item['month'].month: item['count'] for item in monthly}
        for i in range(1, 13):
            monthly_data.append({
                'month': month_names[i - 1],
                'value': month_map.get(i, 0),
            })

        return Response({
            'total_users': total_users,
            'today_new_users': today_new,
            'monthly_activity': monthly_data,
        })


# ══════════════════════════════════════════════════════════════════════════════
# USER MANAGEMENT
# ══════════════════════════════════════════════════════════════════════════════
class UserListView(generics.ListAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = UserListSerializer

    def get_queryset(self):
        return User.objects.filter(role='admin')


class UserToggleView(APIView):
    permission_classes = [IsSuperAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='admin')
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.is_active = serializer.validated_data['is_active']
        user.save()
        return Response({'message': f"User {'enabled' if user.is_active else 'disabled'}."})


class UserDeleteView(APIView):
    permission_classes = [IsSuperAdmin]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='admin')
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({'message': 'User deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ══════════════════════════════════════════════════════════════════════════════
# ADMINISTRATOR MANAGEMENT
# ══════════════════════════════════════════════════════════════════════════════
class AdministratorListView(generics.ListAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = AdministratorSerializer

    def get_queryset(self):
        return User.objects.filter(role__in=['admin', 'superadmin'])


class AdministratorCreateView(generics.CreateAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = CreateAdministratorSerializer


class AdministratorUpdateView(generics.UpdateAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = AdministratorSerializer

    def get_queryset(self):
        return User.objects.filter(role__in=['admin', 'superadmin'])


class AdministratorDeleteView(APIView):
    permission_classes = [IsSuperAdmin]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role__in=['admin', 'superadmin'])
        except User.DoesNotExist:
            return Response({'error': 'Administrator not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user == request.user:
            return Response({'error': 'Cannot delete yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({'message': 'Administrator deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ══════════════════════════════════════════════════════════════════════════════
# ORDERS
# ══════════════════════════════════════════════════════════════════════════════
class OrderListView(generics.ListAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = OrderListSerializer
    queryset = Order.objects.select_related('user').all()


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = OrderDetailSerializer
    queryset = Order.objects.select_related('user').all()


class OrderStatusView(APIView):
    permission_classes = [IsSuperAdmin]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.status = serializer.validated_data['status']
        order.save()
        return Response({'message': f"Order status updated to {order.status}."})


class OrderToggleView(APIView):
    permission_classes = [IsSuperAdmin]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.is_active = serializer.validated_data['is_active']
        order.save()
        return Response({'message': f"Order {'activated' if order.is_active else 'deactivated'}."})


class OrderDeleteView(APIView):
    permission_classes = [IsSuperAdmin]

    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        order.delete()
        return Response({'message': 'Order deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ══════════════════════════════════════════════════════════════════════════════
# NOTIFICATIONS
# ══════════════════════════════════════════════════════════════════════════════
class NotificationListView(generics.ListAPIView):
    permission_classes = [IsSuperAdmin]
    serializer_class = SuperAdminNotificationSerializer
    queryset = SuperAdminNotification.objects.all()


class NotificationReadView(APIView):
    permission_classes = [IsSuperAdmin]

    def patch(self, request, pk):
        try:
            notif = SuperAdminNotification.objects.get(pk=pk)
        except SuperAdminNotification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)

        notif.is_read = True
        notif.save()
        return Response({'message': 'Notification marked as read.'})
