from django.urls import path
from . import views

urlpatterns = [
    # Overview
    path('overview/', views.OverviewView.as_view(), name='dashboard-overview'),

    # Usage Tracker
    path('tracker/', views.TrackerListView.as_view(), name='tracker-list'),
    path('tracker/create/', views.TrackerCreateView.as_view(), name='tracker-create'),
    path('tracker/<int:pk>/', views.TrackerDetailView.as_view(), name='tracker-detail'),

    # Inventory
    path('inventory/', views.InventoryListView.as_view(), name='inventory-list'),

    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/trigger-expiry/', views.TriggerExpiryAlertsView.as_view(), name='trigger-expiry-alerts'),

    # File Uploads
    path('upload-csv/', views.BulkCSVUploadView.as_view(), name='bulk-csv-upload'),
    path('tracker/<int:pk>/upload-msds/', views.MSDSUploadView.as_view(), name='upload-msds'),
]
