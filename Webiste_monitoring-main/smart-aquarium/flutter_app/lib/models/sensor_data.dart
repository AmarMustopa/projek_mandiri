class SensorData {
  final double temperature;
  final double ph;
  final double turbidity;
  final double waterLevel;
  final DateTime timestamp;

  SensorData({
    required this.temperature,
    required this.ph,
    required this.turbidity,
    required this.waterLevel,
    required this.timestamp,
  });

  factory SensorData.fromJson(Map<String, dynamic> json) {
    return SensorData(
      temperature: (json['suhu'] ?? 0).toDouble(),
      ph: (json['ph'] ?? 0).toDouble(),
      turbidity: (json['kekeruhan'] ?? 0).toDouble(),
      waterLevel: (json['water_level'] ?? 75).toDouble(),
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'suhu': temperature,
      'ph': ph,
      'kekeruhan': turbidity,
      'water_level': waterLevel,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  // Status helpers
  String get temperatureStatus {
    if (temperature >= 20 && temperature <= 25) return 'Ideal';
    if (temperature >= 18 && temperature <= 27) return 'Warning';
    return 'Critical';
  }

  String get phStatus {
    if (ph >= 7.0 && ph <= 8.0) return 'Ideal';
    if (ph >= 6.8 && ph <= 8.2) return 'Warning';
    return 'Critical';
  }

  String get turbidityStatus {
    if (turbidity < 5) return 'Good';
    if (turbidity < 10) return 'Warning';
    return 'Critical';
  }

  String get waterLevelStatus {
    if (waterLevel >= 70 && waterLevel <= 90) return 'Normal';
    if (waterLevel > 90) return 'High';
    if (waterLevel < 60) return 'Low';
    return 'Warning';
  }
}
