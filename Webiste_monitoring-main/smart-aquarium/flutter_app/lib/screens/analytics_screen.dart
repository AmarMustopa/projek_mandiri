import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/sensor_provider.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics & Reports'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Consumer<SensorProvider>(
          builder: (context, provider, child) {
            if (provider.sensorHistory.isEmpty) {
              return const Center(
                child: Text('No historical data available'),
              );
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStatisticsCards(provider),
                const SizedBox(height: 24),
                _buildChart(context, 'Temperature Trend', Colors.orange, provider),
                const SizedBox(height: 24),
                _buildChart(context, 'pH Level Trend', Colors.purple, provider),
                const SizedBox(height: 24),
                _buildChart(context, 'Turbidity Trend', Colors.cyan, provider),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildStatisticsCards(SensorProvider provider) {
    final history = provider.sensorHistory;
    final avgTemp = history.map((e) => e.temperature).reduce((a, b) => a + b) / history.length;
    final avgPh = history.map((e) => e.ph).reduce((a, b) => a + b) / history.length;
    final avgTurbidity = history.map((e) => e.turbidity).reduce((a, b) => a + b) / history.length;

    return Row(
      children: [
        Expanded(
          child: _buildStatCard('Avg Temp', '${avgTemp.toStringAsFixed(1)}°C', Colors.orange),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard('Avg pH', avgPh.toStringAsFixed(2), Colors.purple),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard('Avg Turbidity', '${avgTurbidity.toStringAsFixed(1)} NTU', Colors.cyan),
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 12, color: color),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChart(BuildContext context, String title, Color color, SensorProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: true),
                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: true, reservedSize: 40),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(show: true),
                lineBarsData: [
                  LineChartBarData(
                    spots: _getChartData(provider, title),
                    isCurved: true,
                    color: color,
                    barWidth: 3,
                    dotData: FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      color: color.withOpacity(0.1),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<FlSpot> _getChartData(SensorProvider provider, String title) {
    final history = provider.sensorHistory.reversed.toList();
    
    if (title.contains('Temperature')) {
      return List.generate(
        history.length,
        (index) => FlSpot(index.toDouble(), history[index].temperature),
      );
    } else if (title.contains('pH')) {
      return List.generate(
        history.length,
        (index) => FlSpot(index.toDouble(), history[index].ph),
      );
    } else {
      return List.generate(
        history.length,
        (index) => FlSpot(index.toDouble(), history[index].turbidity),
      );
    }
  }
}
