from django.urls import path
from . import influxdb_proxy, debug_views

urlpatterns = [
    path('api/influxdb/test/', influxdb_proxy.test_connection, name='influxdb_test'),
    path('api/influxdb/latest/', influxdb_proxy.get_latest_data, name='influxdb_latest'),
    path('api/influxdb/historical/', influxdb_proxy.get_historical_data, name='influxdb_historical'),
    path('api/debug/influx/', debug_views.debug_influx, name='debug_influx'),
]
