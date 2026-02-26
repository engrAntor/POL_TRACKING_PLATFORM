from django.urls import path
from . import views

urlpatterns = [
    # Overview
    path('overview/', views.OverviewView.as_view(), name='sa-overview'),

    # User Management
    path('users/', views.UserListView.as_view(), name='sa-users'),
    path('users/<int:pk>/toggle/', views.UserToggleView.as_view(), name='sa-user-toggle'),
    path('users/<int:pk>/delete/', views.UserDeleteView.as_view(), name='sa-user-delete'),

    # Administrator Management
    path('administrators/', views.AdministratorListView.as_view(), name='sa-admins'),
    path('administrators/create/', views.AdministratorCreateView.as_view(), name='sa-admin-create'),
    path('administrators/<int:pk>/update/', views.AdministratorUpdateView.as_view(), name='sa-admin-update'),
    path('administrators/<int:pk>/delete/', views.AdministratorDeleteView.as_view(), name='sa-admin-delete'),

    # Orders
    path('orders/', views.OrderListView.as_view(), name='sa-orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='sa-order-detail'),
    path('orders/<int:pk>/status/', views.OrderStatusView.as_view(), name='sa-order-status'),
    path('orders/<int:pk>/toggle/', views.OrderToggleView.as_view(), name='sa-order-toggle'),
    path('orders/<int:pk>/delete/', views.OrderDeleteView.as_view(), name='sa-order-delete'),

]
