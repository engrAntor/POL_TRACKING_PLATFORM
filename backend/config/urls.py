from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),

    # API v1
    path('api/auth/', include('apps.accounts.urls')),
    path('api/dashboard/', include('apps.admin_dashboard.urls')),
    path('api/superadmin/', include('apps.superadmin.urls')),
    path('api/marketplace/', include('apps.marketplace.urls')),
    path('api/ai/', include('apps.pol_ai.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
