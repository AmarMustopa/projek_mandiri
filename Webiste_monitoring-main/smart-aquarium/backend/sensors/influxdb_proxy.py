"""
InfluxDB Proxy View untuk mengatasi CORS issues
"""
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# InfluxDB Configuration
INFLUXDB_URL = "http://103.151.63.80:8099"
INFLUXDB_TOKEN = "NAVV5VsqesiMjfTRDxnC1wPQixvXPXPWlq5ZB33F6B3sv2xR_asMQsfUW4DB58rvmHwxEcj7PClm0c5TlRfKZw=="
INFLUXDB_ORG = "POLINELA"
INFLUXDB_BUCKET = "aquarium"

@csrf_exempt
@require_http_methods(["GET"])
def test_connection(request):
    """Test connection to InfluxDB"""
    try:
        response = requests.get(
            f"{INFLUXDB_URL}/ping",
            timeout=5
        )
        return JsonResponse({
            'success': True,
            'status': response.status_code,
            'message': 'Connected to InfluxDB'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_latest_data(request):
    """Get latest sensor data from InfluxDB"""
    try:
        # Flux query - coba tanpa filter measurement dulu
        flux_query = f'''
from(bucket: "{INFLUXDB_BUCKET}")
  |> range(start: -1h)
  |> last()
'''
        
        headers = {
            'Authorization': f'Token {INFLUXDB_TOKEN}',
            'Accept': 'application/csv',
            'Content-Type': 'application/vnd.flux'
        }
        
        print(f"🔍 Sending query to InfluxDB...")
        print(f"📝 URL: {INFLUXDB_URL}/api/v2/query?org={INFLUXDB_ORG}")
        print(f"📝 Query: {flux_query}")
        
        response = requests.post(
            f"{INFLUXDB_URL}/api/v2/query?org={INFLUXDB_ORG}",
            headers=headers,
            data=flux_query,
            timeout=30
        )
        
        print(f"📡 Response Status: {response.status_code}, Length: {len(response.text)} chars")
        
        if response.status_code == 200:
            # Parse CSV response
            data = parse_flux_response(response.text)
            
            # Debug logging
            print(f"🔍 InfluxDB Raw Response (first 500 chars): {response.text[:500]}")
            print(f"📊 Parsed Data: {data}")
            
            # Langsung return data dari InfluxDB tanpa dummy fallback
            return JsonResponse({
                'success': True,
                'data': data
            })
        else:
            return JsonResponse({
                'success': False,
                'error': f'InfluxDB returned status {response.status_code}',
                'details': response.text
            }, status=response.status_code)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_historical_data(request):
    """Get historical sensor data from InfluxDB"""
    try:
        hours = request.GET.get('hours', '24')
        
        # Flux query for historical data with aggregation
        flux_query = f'''
from(bucket: "{INFLUXDB_BUCKET}")
  |> range(start: -{hours}h)
  |> filter(fn: (r) => r["_measurement"] == "aquarium_status")
  |> filter(fn: (r) => r["_field"] == "temperature" or 
                       r["_field"] == "ph_raw" or 
                       r["_field"] == "turb_raw" or 
                       r["_field"] == "level_cm")
  |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
'''
        
        headers = {
            'Authorization': f'Token {INFLUXDB_TOKEN}',
            'Accept': 'application/csv',
            'Content-Type': 'application/vnd.flux'
        }
        
        response = requests.post(
            f"{INFLUXDB_URL}/api/v2/query?org={INFLUXDB_ORG}",
            headers=headers,
            data=flux_query,
            timeout=10
        )
        
        if response.status_code == 200:
            # Parse CSV response
            data = parse_flux_response_historical(response.text)
            return JsonResponse({
                'success': True,
                'data': data
            })
        else:
            return JsonResponse({
                'success': False,
                'error': f'InfluxDB returned status {response.status_code}'
            }, status=response.status_code)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def parse_flux_response(csv_data):
    """Parse InfluxDB Flux CSV response to JSON - take latest value per field"""
    lines = csv_data.strip().split('\n')
    
    result = {
        'temperature': None,
        'ph_raw': None,
        'ph_status': None,
        'turb_raw': None,
        'turb_status': None,
        'level_cm': None,
        'state': None,
        'timestamp': None
    }
    
    # Find header to determine column positions
    header_idx = {}
    data_started = False
    
    for line in lines:
        # Skip annotation lines starting with #
        if line.startswith('#'):
            continue
        
        # Find header line (contains column names)
        if not data_started and ',result,' in line:
            parts = line.split(',')
            for i, col in enumerate(parts):
                header_idx[col] = i
            data_started = True
            print(f"📋 CSV Header: {header_idx}")
            continue
        
        # Skip empty lines
        if not line.strip():
            continue
        
        # Parse data lines
        if data_started:
            parts = line.split(',')
            if len(parts) > max(header_idx.values()):
                try:
                    # Get field name and value
                    field = parts[header_idx.get('_field', 7)]
                    value_str = parts[header_idx.get('_value', 6)]
                    time_str = parts[header_idx.get('_time', 5)]
                    
                    # Store value if field is in our result dict
                    if field in result:
                        try:
                            result[field] = float(value_str)
                        except:
                            result[field] = value_str
                        
                        # Update timestamp
                        if not result['timestamp']:
                            result['timestamp'] = time_str
                    
                    print(f"  📊 Field: {field} = {value_str}")
                except Exception as e:
                    print(f"  ⚠️ Error parsing line: {e}")
    
    print(f"🔍 Final Parsed result: {result}")
    return result

def parse_flux_response_historical(csv_data):
    """Parse historical InfluxDB Flux CSV response to JSON array"""
    lines = csv_data.strip().split('\n')
    
    data_points = []
    
    for line in lines:
        if line.startswith(',') or line.startswith('#'):
            continue
            
        parts = line.split(',')
        if len(parts) >= 7:
            field = parts[6]  # _field column
            value = parts[5]  # _value column
            time = parts[4]   # _time column
            
            try:
                data_points.append({
                    'field': field,
                    'value': float(value),
                    'timestamp': time
                })
            except:
                pass
    
    return data_points
