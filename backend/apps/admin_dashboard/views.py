import csv
import io
from datetime import datetime

from django.db.models import Count, Sum, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from apps.accounts.permissions import IsAdmin
from .models import POLItem, Notification
from .serializers import (
    POLItemSerializer, POLItemCreateSerializer,
    NotificationSerializer,
)


# ══════════════════════════════════════════════════════════════════════════════
# OVERVIEW / DASHBOARD STATS
# ══════════════════════════════════════════════════════════════════════════════
class OverviewView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        user = request.user
        today = timezone.now().date()

        total_items = POLItem.objects.filter(user=user).count()
        near_expiry = POLItem.objects.filter(
            user=user, expiry_status='near_expiry'
        ).count()
        low_stock = POLItem.objects.filter(user=user, status='low_stock').count()
        active_transactions = user.orders.filter(
            status__in=['pending', 'approved']
        ).count()

        # Stock levels by status
        stock_levels = (
            POLItem.objects.filter(user=user)
            .values('status')
            .annotate(total_qty=Sum('quantity'))
            .order_by('status')
        )

        # Recent orders
        from apps.superadmin.models import Order
        recent_orders = Order.objects.filter(user=user).select_related('user')[:10]
        orders_data = [{
            'id': o.id,
            'product_name': o.product_name,
            'quantity': str(o.quantity),
            'status': o.status,
            'updated_at': o.updated_at.isoformat(),
        } for o in recent_orders]

        return Response({
            'total_pol_items': total_items,
            'near_expiry': near_expiry,
            'low_stock': low_stock,
            'active_transactions': active_transactions,
            'stock_levels': list(stock_levels),
            'recent_orders': orders_data,
        })


# ══════════════════════════════════════════════════════════════════════════════
# USAGE TRACKER (POL Items - full CRUD)
# ══════════════════════════════════════════════════════════════════════════════
class TrackerListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = POLItemSerializer
    pagination_class = None
    filterset_fields = ['status', 'expiry_status']
    search_fields = ['product_name', 'part_number']
    ordering_fields = ['expiry', 'created_at', 'product_name']

    def get_queryset(self):
        return POLItem.objects.filter(user=self.request.user)


class TrackerCreateView(generics.CreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = POLItemCreateSerializer


class TrackerDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = POLItemSerializer

    def get_queryset(self):
        return POLItem.objects.filter(user=self.request.user)


# ══════════════════════════════════════════════════════════════════════════════
# INVENTORY (same POL Items, different filters)
# ══════════════════════════════════════════════════════════════════════════════
class InventoryListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = POLItemSerializer
    pagination_class = None
    filterset_fields = ['status', 'expiry_status']
    search_fields = ['product_name', 'part_number']

    def get_queryset(self):
        return POLItem.objects.filter(user=self.request.user)


# ══════════════════════════════════════════════════════════════════════════════
# NOTIFICATIONS
# ══════════════════════════════════════════════════════════════════════════════
class NotificationListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = NotificationSerializer
    pagination_class = None

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class TriggerExpiryAlertsView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        from .tasks import generate_expiry_alerts
        count = generate_expiry_alerts(request.user)
        return Response({'message': f'{count} new expiry alerts generated.'})


# ══════════════════════════════════════════════════════════════════════════════
# BULK CSV UPLOAD
# ══════════════════════════════════════════════════════════════════════════════
class BulkCSVUploadView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'No file provided.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not file.name.endswith('.csv'):
            return Response(
                {'error': 'Only CSV files are accepted.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            decoded = file.read().decode('utf-8')
            reader = csv.DictReader(io.StringIO(decoded))
        except Exception:
            return Response(
                {'error': 'Could not read CSV file.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created = 0
        errors = []
        today = timezone.now().date()

        for i, row in enumerate(reader, start=2):
            try:
                part_number = row.get('Partnumber', '').strip()
                product_name = row.get('Part Description', '').strip()
                quantity = row.get('QREQ', '0').strip()
                shelf_life_days = row.get('SHELF LIFE', '0').strip()
                good_till = row.get('GOOD TILL', '').strip()

                if not part_number or not product_name:
                    errors.append(f"Row {i}: Missing part number or description.")
                    continue

                expiry_date = datetime.strptime(good_till, '%Y-%m-%d').date()
                shelf_life_str = f"{shelf_life_days} days"

                # Determine expiry status
                days_left = (expiry_date - today).days
                if days_left < 0:
                    expiry_status = 'expired'
                elif days_left <= 90:
                    expiry_status = 'near_expiry'
                else:
                    expiry_status = 'active'

                POLItem.objects.create(
                    user=request.user,
                    product_name=product_name,
                    part_number=part_number,
                    shelf_life=shelf_life_str,
                    expiry=expiry_date,
                    expiry_status=expiry_status,
                    quantity=float(quantity) if quantity else 0,
                    price_per_unit=0,
                )
                created += 1
            except Exception as e:
                errors.append(f"Row {i}: {str(e)}")

        return Response({
            'message': f'{created} items imported successfully.',
            'created': created,
            'errors': errors,
        })


# ══════════════════════════════════════════════════════════════════════════════
# MSDS FILE UPLOAD (attach PDF to existing POL item)
# ══════════════════════════════════════════════════════════════════════════════
class MSDSUploadView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk):
        try:
            item = POLItem.objects.get(pk=pk, user=request.user)
        except POLItem.DoesNotExist:
            return Response(
                {'error': 'POL item not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'No file provided.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item.msds_file = file
        item.save()
        return Response({
            'message': 'MSDS file uploaded successfully.',
            'msds_file': request.build_absolute_uri(item.msds_file.url),
        })
