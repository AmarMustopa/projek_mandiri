import 'dart:async';
import 'package:flutter/material.dart';
import '../models/sensor_data.dart';
import '../services/influxdb_service.dart';

class SensorProvider with ChangeNotifier {
  final InfluxDBService _influxService = InfluxDBService();
  List<SensorData> _sensorHistory = [];
  SensorData? _latestData;
  bool _isLoading = false;
  String? _error;
  Timer? _timer;
  
  // Pump control
  bool _isPumpOn = false;
  bool _isAutoMode = true;

  List<SensorData> get sensorHistory => _sensorHistory;
  SensorData? get latestData => _latestData;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isPumpOn => _isPumpOn;
  bool get isAutoMode => _isAutoMode;

  SensorProvider() {
    fetchData();
    startAutoRefresh();
  }

  void startAutoRefresh() {
    // Update setiap 5 detik untuk data realtime
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      fetchData();
    });
  }

  Future<void> fetchData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Ambil data dari InfluxDB
      final data = await _influxService.getLatestData();
      
      if (data != null) {
        _latestData = data;
        
        // Tambahkan ke history (max 50 data points)
        _sensorHistory.insert(0, data);
        if (_sensorHistory.length > 50) {
          _sensorHistory = _sensorHistory.sublist(0, 50);
        }
        
        // Auto pump control based on turbidity
        if (_isAutoMode && data.turbidity > 10) {
          _isPumpOn = true;
        } else if (_isAutoMode && data.turbidity < 5) {
          _isPumpOn = false;
        }
        
        print('✅ Data updated: temp=${data.temperature}, turb=${data.turbidity}');
      }
      
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = 'Gagal mengambil data: ${e.toString()}';
      _isLoading = false;
      notifyListeners();
      print('❌ Error in SensorProvider: $e');
    }
  }

  void togglePump() {
    _isPumpOn = !_isPumpOn;
    notifyListeners();
  }

  void toggleMode() {
    _isAutoMode = !_isAutoMode;
    notifyListeners();
  }

  int get habitatScore {
    if (_latestData == null) return 0;
    
    int score = 100;
    
    // Temperature penalty
    if (_latestData!.temperatureStatus == 'Warning') score -= 10;
    if (_latestData!.temperatureStatus == 'Critical') score -= 30;
    
    // pH penalty
    if (_latestData!.phStatus == 'Warning') score -= 10;
    if (_latestData!.phStatus == 'Critical') score -= 30;
    
    // Turbidity penalty
    if (_latestData!.turbidityStatus == 'Warning') score -= 15;
    if (_latestData!.turbidityStatus == 'Critical') score -= 35;
    
    // Water level penalty
    if (_latestData!.waterLevelStatus != 'Normal') score -= 10;
    
    return score.clamp(0, 100);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
