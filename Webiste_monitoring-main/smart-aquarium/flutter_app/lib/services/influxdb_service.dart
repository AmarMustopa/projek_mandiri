import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/sensor_data.dart';

class InfluxDBService {
  // Base URL - sesuaikan dengan IP komputer Anda
  // Untuk emulator Android: http://10.0.2.2:8000
  // Untuk device fisik: ganti dengan IP lokal komputer (misal: http://192.168.1.100:8000)
  // Untuk web/desktop: http://127.0.0.1:8000
  static const String baseUrl = 'http://127.0.0.1:8000';
  
  /// Get latest sensor data from InfluxDB via Django proxy
  Future<SensorData?> getLatestData() async {
    try {
      print('🔍 Fetching data from: $baseUrl/api/influxdb/latest/');
      
      final response = await http.get(
        Uri.parse('$baseUrl/api/influxdb/latest/'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw Exception('Request timeout - Server tidak merespon');
        },
      );

      print('📡 Response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        
        print('📦 Response data: $jsonData');
        
        if (jsonData['success'] == true && jsonData['data'] != null) {
          final sensorData = _parseInfluxData(jsonData['data']);
          print('✅ Data parsed successfully');
          return sensorData;
        } else {
          print('⚠️ No data available');
          throw Exception('No data available from InfluxDB');
        }
      } else {
        print('❌ HTTP Error: ${response.statusCode}');
        throw Exception('Failed to load data: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching from InfluxDB: $e');
      rethrow;
    }
  }

  /// Parse InfluxDB response to SensorData model
  SensorData _parseInfluxData(Map<String, dynamic> data) {
    // Extract values from InfluxDB response
    final temperature = _toDouble(data['temperature']) ?? 25.0;
    final phRaw = _toDouble(data['ph_raw']) ?? 7.0;
    final turbRaw = _toDouble(data['turb_raw']) ?? 5.0;
    final levelCm = _toDouble(data['level_cm']) ?? 80.0;
    
    // Convert to percentage (assuming max 100cm)
    final waterLevel = (levelCm / 100 * 100).clamp(0.0, 100.0).toDouble();
    
    // Parse timestamp
    final timestamp = data['timestamp'] != null
        ? DateTime.tryParse(data['timestamp']) ?? DateTime.now()
        : DateTime.now();

    print('📊 Parsed InfluxDB data: temp=$temperature, ph=$phRaw, turb=$turbRaw, level=$levelCm');

    return SensorData(
      temperature: temperature,
      ph: phRaw,
      turbidity: turbRaw,
      waterLevel: waterLevel,
      timestamp: timestamp,
    );
  }

  /// Test connection to backend
  Future<bool> testConnection() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/influxdb/test/'),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return jsonData['success'] == true;
      }
      return false;
    } catch (e) {
      print('❌ Connection test failed: $e');
      return false;
    }
  }

  /// Helper to safely convert dynamic to double
  double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }
}
