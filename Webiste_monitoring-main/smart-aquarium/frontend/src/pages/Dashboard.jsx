import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import SensorTable from '../components/SensorTable';
import RealtimeChart from '../components/RealtimeChart';
import PumpControl from '../components/PumpControl';
import LogsNotification from '../components/LogsNotification';
import useSensorSimulation from '../hooks/useSensorSimulation';

const Dashboard = () => {
  const {
    sensorData,
    chartData,
    pumpStatus,
    pumpMode,
    logs,
    alerts,
    habitatScore,
    handlePumpModeChange,
    handleManualPumpControl,
  } = useSensorSimulation();

  // Helper functions for status classification
  const getTurbidityStatus = (turbidity) => {
    if (turbidity < 5) return 'Baik';
    if (turbidity < 10) return 'Warning';
    return 'Bahaya';
  };

  const getTemperatureStatus = (temp) => {
    if (temp >= 20 && temp <= 25) return 'Ideal';
    if (temp >= 18 && temp <= 27) return 'Warning';
    return 'Bahaya';
  };

  const getPhStatus = (ph) => {
    if (ph >= 7.0 && ph <= 8.0) return 'Ideal';
    if (ph >= 6.8 && ph <= 8.2) return 'Warning';
    return 'Bahaya';
  };

  const getWaterLevelStatus = (level) => {
    if (level >= 70 && level <= 90) return 'Normal';
    if (level > 90) return 'Overflow';
    if (level < 60) return 'Bahaya';
    return 'Warning';
  };

  const getHabitatScoreStatus = (score) => {
    if (score >= 80) return 'Baik';
    if (score >= 60) return 'Warning';
    return 'Bahaya';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-8 py-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Aquarium Monitoring</h1>
              <p className="text-sm text-gray-500 mt-1">Comet Goldfish Water Quality Dashboard - Real-time IoT Monitoring</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Export Data
            </button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Sensors"
              value="4"
              subtitle="2 Active Monitoring"
              iconBg="bg-indigo-100"
              icon={
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            
            <DashboardCard
              title="Active Readings"
              value={chartData.turbidity.length}
              subtitle={`${chartData.turbidity.length} Data Points Collected`}
              iconBg="bg-purple-100"
              icon={
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4" />
                </svg>
              }
            />
            
            <DashboardCard
              title="Automation Status"
              value={pumpMode === 'auto' ? 'AUTO' : 'MANUAL'}
              subtitle={pumpStatus === 'OFF' ? 'Pump Standby' : `Pump ${pumpStatus}`}
              iconBg="bg-cyan-100"
              icon={
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            
            <DashboardCard
              title="Habitat Health"
              value={`${habitatScore}%`}
              subtitle={habitatScore >= 80 ? 'Excellent Condition' : habitatScore >= 60 ? 'Good Condition' : 'Need Attention'}
              iconBg="bg-green-100"
              progress={habitatScore}
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
          </div>

          {/* Sensor Table */}
          <SensorTable sensorData={sensorData} chartData={chartData} />

          {/* Real-time Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Turbidity Monitoring</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Real-time water clarity tracking</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Live</span>
              </div>
              <RealtimeChart
                title="Turbidity"
                data={chartData.turbidity}
                dataKey="Turbidity"
                color="#06b6d4"
                unit="NTU"
                idealRange="< 10 NTU"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Temperature Control</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Optimal temperature range 20-25°C</p>
                </div>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">Live</span>
              </div>
              <RealtimeChart
                title="Suhu Air"
                data={chartData.temperature}
                dataKey="Temperature"
                color="#f59e0b"
                unit="°C"
                idealRange="20-25°C"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">pH Level Balance</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Maintaining neutral pH 7.0-8.0</p>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Live</span>
              </div>
              <RealtimeChart
                title="pH Air"
                data={chartData.ph}
                dataKey="pH"
                color="#8b5cf6"
                unit=""
                idealRange="7.0-8.0"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Water Level Status</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Target range 70-90%</p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Live</span>
              </div>
              <RealtimeChart
                title="Level Air"
                data={chartData.waterLevel}
                dataKey="WaterLevel"
                color="#10b981"
                unit="%"
                idealRange="70-90%"
              />
            </div>
          </div>

          {/* Pump Control & System Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <PumpControl
                pumpStatus={pumpStatus}
                mode={pumpMode}
                onModeChange={handlePumpModeChange}
                onManualControl={handleManualPumpControl}
                turbidity={sensorData.turbidity}
              />
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Comet Goldfish Care Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">💧 Kualitas Air</p>
                      <p className="text-cyan-100">Turbidity {'<'} 10 NTU, pH 7.0-8.0</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">🌡️ Suhu Ideal</p>
                      <p className="text-cyan-100">20-25°C untuk pertumbuhan optimal</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">🔄 Pergantian Air</p>
                      <p className="text-cyan-100">Otomatis saat turbidity tinggi</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">📊 Monitoring</p>
                      <p className="text-cyan-100">Update data setiap 5 detik</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logs and Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <LogsNotification logs={logs} alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
