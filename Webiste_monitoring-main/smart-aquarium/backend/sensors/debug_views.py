"""
Debug endpoint untuk test InfluxDB connection
"""
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

INFLUXDB_URL = "http://103.151.63.80:8099"
INFLUXDB_TOKEN = "NAVV5VsqesiMjfTRDxnC1wPQixvXPXPWlq5ZB33F6B3sv2xR_asMQsfUW4DB58rvmHwxEcj7PClm0c5TlRfKZw=="
INFLUXDB_ORG = "POLINELA"
INFLUXDB_BUCKET = "aquarium"

@csrf_exempt
def debug_influx(request):
    """Debug InfluxDB - show raw response"""
    
    # Simple query to get latest data from aquarium measurement
    flux_query = f'''
from(bucket: "{INFLUXDB_BUCKET}")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "aquarium_status")
  |> last()
'''
    
    try:
        headers = {
            'Authorization': f'Token {INFLUXDB_TOKEN}',
            'Accept': 'application/csv',
            'Content-Type': 'application/vnd.flux'
        }
        
        print(f"🔍 Sending debug query to InfluxDB...")
        
        response = requests.post(
            f"{INFLUXDB_URL}/api/v2/query?org={INFLUXDB_ORG}",
            headers=headers,
            data=flux_query,
            timeout=30
        )
        
        print(f"📡 Debug Response received: {response.status_code}")
        
        return JsonResponse({
            'status_code': response.status_code,
            'raw_response': response.text,
            'response_length': len(response.text),
            'query': flux_query,
            'url': f"{INFLUXDB_URL}/api/v2/query?org={INFLUXDB_ORG}"
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'error_type': type(e).__name__
        }, status=500)
