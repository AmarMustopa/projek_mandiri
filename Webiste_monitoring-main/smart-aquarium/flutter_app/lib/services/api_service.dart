import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/sensor_data.dart';

class ApiService {
  // Change this to your backend URL
  static const String baseUrl = 'http://127.0.0.1:8000';
  
  Future<List<SensorData>> fetchSensorData() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/dummy-sensors/'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => SensorData.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load sensor data');
      }
    } catch (e) {
      print('Error fetching sensor data: $e');
      // Return dummy data for development
      return _getDummyData();
    }
  }

  List<SensorData> _getDummyData() {
    final now = DateTime.now();
    return List.generate(10, (index) {
      return SensorData(
        temperature: 22.0 + (index % 3) * 0.5,
        ph: 7.0 + (index % 4) * 0.1,
        turbidity: 5.0 + (index % 5) * 1.0,
        waterLevel: 75.0 + (index % 6) * 2.0,
        timestamp: now.subtract(Duration(minutes: index * 5)),
      );
    });
  }
}
