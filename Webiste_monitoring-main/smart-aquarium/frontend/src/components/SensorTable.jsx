import React from 'react';

const SensorTable = ({ sensorData, chartData }) => {
  const sensorReadings = [
    {
      name: 'Turbidity Monitor',
      icon: (
        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      value: `${sensorData.turbidity.toFixed(2)} NTU`,
      status: sensorData.turbidity < 10 ? 'Normal' : 'High',
      statusColor: sensorData.turbidity < 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      dataPoints: chartData.turbidity.length,
      progress: Math.max(0, 100 - (sensorData.turbidity / 20) * 100),
    },
    {
      name: 'Temperature Sensor',
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      value: `${sensorData.temperature.toFixed(1)}°C`,
      status: sensorData.temperature >= 20 && sensorData.temperature <= 25 ? 'Ideal' : 'Warning',
      statusColor: sensorData.temperature >= 20 && sensorData.temperature <= 25 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
      dataPoints: chartData.temperature.length,
      progress: ((sensorData.temperature - 15) / 15) * 100,
    },
    {
      name: 'pH Level Sensor',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      value: sensorData.ph.toFixed(2),
      status: sensorData.ph >= 7.0 && sensorData.ph <= 8.0 ? 'Ideal' : 'Warning',
      statusColor: sensorData.ph >= 7.0 && sensorData.ph <= 8.0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
      dataPoints: chartData.ph.length,
      progress: ((sensorData.ph - 6) / 3) * 100,
    },
    {
      name: 'Water Level Sensor',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      value: `${sensorData.waterLevel}%`,
      status: sensorData.waterLevel >= 70 ? 'Normal' : 'Low',
      statusColor: sensorData.waterLevel >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
      dataPoints: 20,
      progress: sensorData.waterLevel,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Active Sensor Readings</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sensor Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reading
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sensorReadings.map((sensor, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      {sensor.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{sensor.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">{sensor.value}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sensor.statusColor}`}>
                    {sensor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {[...Array(Math.min(3, Math.floor(sensor.dataPoints / 5)))].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {i + 1}
                        </div>
                      ))}
                      {sensor.dataPoints > 15 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                          +{sensor.dataPoints - 15}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, sensor.progress)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {Math.round(Math.min(100, sensor.progress))}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorTable;
