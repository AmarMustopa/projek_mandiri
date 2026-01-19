 import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const WaterClarityStatus = ({ turbidity = 6.53 }) => {
  // Determine clarity status based on turbidity
  // Jernih (Clear): < 5 NTU
  // Normal: 5-10 NTU
  // Tidak Jernih (Cloudy): > 10 NTU
  
  const isClear = turbidity < 5;
  const isNormal = turbidity >= 5 && turbidity < 10;
  const isCloudy = turbidity >= 10;

  // Calculate percentages for the chart
  const clearPercentage = isClear ? 100 : isNormal ? 50 : 25;
  const cloudyPercentage = isCloudy ? 75 : isNormal ? 50 : 0;

  const data = [
    { name: 'Jernih (Clear)', value: clearPercentage, color: '#0ea5e9' },
    { name: 'Tidak Jernih (Cloudy)', value: cloudyPercentage, color: '#f97316' }
  ];

  // Status label based on turbidity
  const getStatusLabel = () => {
    if (isClear) return 'Jernih';
    if (isNormal) return 'Normal';
    return 'Tidak Jernih';
  };

  const getStatusColor = () => {
    if (isClear) return '#0ea5e9';
    if (isNormal) return '#84cc16';
    return '#f97316';
  };

  const getStatusBgColor = () => {
    if (isClear) return 'bg-cyan-50';
    if (isNormal) return 'bg-lime-50';
    return 'bg-orange-50';
  };

  return (
    <div className={`${getStatusBgColor()} rounded-xl border-2 p-8`} style={{ borderColor: getStatusColor() }}>
      <div className="flex flex-col items-center">
        {/* Circular Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="text-center -mt-12">
          <p className="text-4xl font-bold" style={{ color: getStatusColor() }}>
            {getStatusLabel()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Turbidity: {turbidity.toFixed(2)} NTU
          </p>
        </div>

        {/* Status Details */}
        <div className="mt-8 w-full grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-cyan-300">
            <p className="text-xs text-gray-600 font-medium">Jernih</p>
            <p className="text-2xl font-bold text-cyan-600">
              {isClear ? '✓' : '○'}
            </p>
            <p className="text-xs text-gray-500 mt-1">&lt; 5 NTU</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
            <p className="text-xs text-gray-600 font-medium">Tidak Jernih</p>
            <p className="text-2xl font-bold text-orange-600">
              {isCloudy ? '✓' : '○'}
            </p>
            <p className="text-xs text-gray-500 mt-1">&gt; 10 NTU</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-6 w-full space-y-2">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Kondisi Ideal</span>
            <span className="text-xs font-semibold px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">
              &lt; 5 NTU
            </span>
          </div>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Status Saat Ini</span>
            <span 
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: getStatusColor() + '20',
                color: getStatusColor()
              }}
            >
              {turbidity.toFixed(2)} NTU
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterClarityStatus;
