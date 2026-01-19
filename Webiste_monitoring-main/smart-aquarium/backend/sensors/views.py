from rest_framework import viewsets
from .models import Sensor
from .serializers import SensorSerializer

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all().order_by('-timestamp')
    serializer_class = SensorSerializer


from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
from datetime import datetime, timedelta
import pytz


@api_view(['GET'])
def get_sensor_data(request):
    """Membaca dan mengembalikan data dari file CSV."""
    try:
        import pandas as pd
        import os
        
        # Baca file CSV
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'IoTpond1.csv')
        df = pd.read_csv(csv_path)
        
        # Konversi data ke format yang sesuai
        data = []
        for _, row in df.iterrows():
            data.append({
                "suhu": float(row['temperature']),
                "ph": float(row['ph_level']),
                "kekeruhan": float(row['turbidity']),
                "oksigen": float(row['oxygen_level']),
                "amonia": float(row['ammonia_level']),
                "status": row['status'],
                "timestamp": row['timestamp']
            })
            
        return Response({
            'data': data,
            'stats': {
                'status_distribution': {
                    'Normal': len(df[df['status'] == 'Normal']),
                    'Warning': len(df[df['status'] == 'Warning']),
                    'Critical': len(df[df['status'] == 'Critical'])
                },
                'averages': {
                    'temperature': float(df['temperature'].mean()),
                    'ph_level': float(df['ph_level'].mean()),
                    'oxygen_level': float(df['oxygen_level'].mean()),
                    'ammonia_level': float(df['ammonia_level'].mean())
                }
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def dummy_sensors(request):
    """Mengembalikan daftar pembacaan sensor dummy untuk keperluan demo."""
    # nilai dasar
    base = [
        {"suhu": 27.5, "ph": 7.2, "kekeruhan": 15},
        {"suhu": 28.1, "ph": 7.4, "kekeruhan": 12},
        {"suhu": 26.9, "ph": 7.1, "kekeruhan": 17}
    ]
    # Gunakan waktu Asia/Jakarta
    timezone = pytz.timezone('Asia/Jakarta')
    now = datetime.now(timezone)
    data = []
    for i, b in enumerate(base):
        # tambahkan sedikit noise random untuk simulasi pembacaan live
        suhu = round(b['suhu'] + random.uniform(-0.5, 0.5), 1)
        ph = round(b['ph'] + random.uniform(-0.15, 0.15), 2)
        kekeruhan = max(0, int(b['kekeruhan'] + random.uniform(-3, 3)))
        ts = (now - timedelta(minutes=(len(base)-1-i))).strftime('%Y-%m-%d %H:%M:%S')
        data.append({"suhu": suhu, "ph": ph, "kekeruhan": kekeruhan, "timestamp": ts})
    return Response(data)
