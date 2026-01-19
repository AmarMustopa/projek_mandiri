import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/sensor_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/sensor_card.dart';
import '../widgets/status_indicator.dart';
import 'login_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Sistem Aquarium', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text('IoT Monitoring System', style: TextStyle(fontSize: 12)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // Show notifications
            },
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.account_circle),
            onSelected: (value) async {
              if (value == 'logout') {
                await context.read<AuthProvider>().logout();
                if (context.mounted) {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                  );
                }
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'profile',
                child: Row(
                  children: [
                    const Icon(Icons.person_outline, size: 20),
                    const SizedBox(width: 12),
                    Text(context.read<AuthProvider>().user?.username ?? 'User'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, size: 20, color: Colors.red),
                    SizedBox(width: 12),
                    Text('Logout', style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => context.read<SensorProvider>().fetchData(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Consumer<SensorProvider>(
            builder: (context, provider, child) {
              if (provider.isLoading && provider.latestData == null) {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }

              if (provider.error != null && provider.latestData == null) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(provider.error!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => provider.fetchData(),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                );
              }

              final data = provider.latestData;
              if (data == null) {
                return const Center(child: Text('No data available'));
              }

              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Habitat Health Score
                  _buildHealthScore(context, provider.habitatScore),
                  const SizedBox(height: 24),
                  
                  // Sensor Cards
                  const Text(
                    'Sensor Readings',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  SensorCard(
                    title: 'Water Temperature',
                    value: '${data.temperature.toStringAsFixed(1)}°C',
                    icon: Icons.thermostat,
                    color: Colors.orange,
                    status: data.temperatureStatus,
                    idealRange: '20-25°C',
                  ),
                  const SizedBox(height: 12),
                  SensorCard(
                    title: 'pH Level',
                    value: data.ph.toStringAsFixed(2),
                    icon: Icons.water_drop,
                    color: Colors.purple,
                    status: data.phStatus,
                    idealRange: '7.0-8.0',
                  ),
                  const SizedBox(height: 12),
                  SensorCard(
                    title: 'Water Turbidity',
                    value: '${data.turbidity.toStringAsFixed(1)} NTU',
                    icon: Icons.opacity,
                    color: Colors.cyan,
                    status: data.turbidityStatus,
                    idealRange: '< 5 NTU',
                  ),
                  const SizedBox(height: 12),
                  SensorCard(
                    title: 'Water Level',
                    value: '${data.waterLevel.toStringAsFixed(1)}%',
                    icon: Icons.waves,
                    color: Colors.blue,
                    status: data.waterLevelStatus,
                    idealRange: '70-90%',
                  ),
                  const SizedBox(height: 24),
                  
                  // Quick Actions
                  const Text(
                    'Quick Actions',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildActionButton(
                          context,
                          icon: provider.isPumpOn ? Icons.water : Icons.water_damage_outlined,
                          label: provider.isPumpOn ? 'Pump ON' : 'Pump OFF',
                          color: provider.isPumpOn ? Colors.green : Colors.grey,
                          onTap: () => provider.togglePump(),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionButton(
                          context,
                          icon: provider.isAutoMode ? Icons.auto_mode : Icons.touch_app,
                          label: provider.isAutoMode ? 'Auto Mode' : 'Manual',
                          color: provider.isAutoMode ? Colors.cyan : Colors.orange,
                          onTap: () => provider.toggleMode(),
                        ),
                      ),
                    ],
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildHealthScore(BuildContext context, int score) {
    Color scoreColor;
    String scoreLabel;
    
    if (score >= 80) {
      scoreColor = Colors.green;
      scoreLabel = 'Excellent';
    } else if (score >= 60) {
      scoreColor = Colors.orange;
      scoreLabel = 'Good';
    } else {
      scoreColor = Colors.red;
      scoreLabel = 'Needs Attention';
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [scoreColor.withOpacity(0.2), scoreColor.withOpacity(0.1)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: scoreColor.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: scoreColor.withOpacity(0.2),
            ),
            child: Center(
              child: Text(
                '$score',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: scoreColor,
                ),
              ),
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Habitat Health Score',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  scoreLabel,
                  style: TextStyle(fontSize: 14, color: scoreColor),
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: score / 100,
                  backgroundColor: Colors.grey.shade200,
                  valueColor: AlwaysStoppedAnimation(scoreColor),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
