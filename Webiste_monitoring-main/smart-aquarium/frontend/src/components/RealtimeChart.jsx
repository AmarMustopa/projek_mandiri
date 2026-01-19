import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RealtimeChart = ({ title, data, dataKey, color, unit, idealRange }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700">{payload[0].payload.time}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium" style={{ color: color }}>{title}: </span>
            <span className="font-bold">{payload[0].value} {unit}</span>
          </p>
          {idealRange && (
            <p className="text-xs text-gray-500 mt-1">
              Ideal: {idealRange}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="time" 
          stroke="#9ca3af"
          style={{ fontSize: '11px' }}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#9ca3af"
          style={{ fontSize: '11px' }}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
          name={title}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RealtimeChart;
