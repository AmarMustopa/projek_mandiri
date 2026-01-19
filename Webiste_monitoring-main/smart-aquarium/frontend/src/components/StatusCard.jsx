import React from 'react';

const StatusCard = ({ title, value, unit, status, icon, trend, description }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Baik':
      case 'Ideal':
      case 'Normal':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-700',
          badge: 'bg-green-100 text-green-800',
          icon: 'text-green-600'
        };
      case 'Warning':
      case 'Perhatian':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800',
          icon: 'text-yellow-600'
        };
      case 'Bahaya':
      case 'Critical':
      case 'Low':
      case 'Overflow':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800',
          icon: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  const colors = getStatusColor();

  return (
    <div className={`${colors.bg} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${colors.icon} bg-white p-3 rounded-lg shadow-sm`}>
            {icon}
          </div>
          <div>
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
            {description && (
              <p className="text-gray-400 text-xs mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}>
          {status}
        </span>
      </div>
      
      <div className="flex items-baseline space-x-2">
        <span className={`${colors.text} text-3xl font-bold`}>
          {value}
        </span>
        <span className="text-gray-500 text-lg font-medium">{unit}</span>
      </div>

      {trend && (
        <div className="mt-3 flex items-center space-x-2">
          {trend.direction === 'up' ? (
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : trend.direction === 'down' ? (
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-sm text-gray-600">{trend.text}</span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
