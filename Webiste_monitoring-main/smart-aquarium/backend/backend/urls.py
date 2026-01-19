from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from sensors.views import SensorViewSet, dummy_sensors, get_sensor_data
from dashboard_views import dashboard_view, analytics_view, settings_view
from accounts.views import login_view, register_view, logout_view
from accounts.api_views import api_login, api_register

router = routers.DefaultRouter()
router.register(r'sensors', SensorViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/dummy-sensors/', dummy_sensors),
    path('api/sensor-data/', get_sensor_data),
    path('api/login/', api_login, name='api_login'),  # Mobile API with CSRF exempt
    path('api/register/', api_register, name='api_register'),  # Mobile API with CSRF exempt
    path('', include('sensors.urls')),  # InfluxDB proxy endpoints
    path('', dashboard_view, name='dashboard'),
    path('analytics/', analytics_view, name='analytics'),
    path('settings/', settings_view, name='settings'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
]
