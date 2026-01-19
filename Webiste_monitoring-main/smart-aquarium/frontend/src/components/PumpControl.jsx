import React, { useState } from 'react';

const PumpControl = ({ pumpStatus, mode, onModeChange, onManualControl, turbidity }) => {
  const [isManual, setIsManual] = useState(mode === 'manual');

  const handleModeToggle = () => {
    const newMode = isManual ? 'auto' : 'manual';
    setIsManual(!isManual);
    onModeChange(newMode);
  };

  const getPumpStatusColor = () => {
    if (pumpStatus === 'Buang Air') {
      return {
        bg: 'bg-orange-50 border-orange-300',
        text: 'text-orange-700',
        icon: 'text-orange-600',
        indicator: 'bg-orange-500'
      };
    } else if (pumpStatus === 'Isi Air') {
      return {
        bg: 'bg-blue-50 border-blue-300',
        text: 'text-blue-700',
        icon: 'text-blue-600',
        indicator: 'bg-blue-500'
      };
    } else {
      return {
        bg: 'bg-green-50 border-green-300',
        text: 'text-green-700',
        icon: 'text-green-600',
        indicator: 'bg-green-500'
      };
    }
  };

  const colors = getPumpStatusColor();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pump Control</h3>
          <p className="text-sm text-gray-500 mt-0.5">Water Management System</p>
        </div>
        <div className={`${colors.indicator} w-2.5 h-2.5 rounded-full animate-pulse`}></div>
      </div>

      {/* Status Pompa */}
      <div className={`${colors.bg} border-2 rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${colors.indicator} w-3 h-3 rounded-full animate-pulse`}></div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Status Pompa</p>
              <p className={`${colors.text} text-lg font-bold`}>{pumpStatus}</p>
            </div>
          </div>
          <div className={`${colors.icon}`}>
            {pumpStatus === 'OFF' ? (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            ) : pumpStatus === 'Buang Air' ? (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            ) : (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Mode Control */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">Mode Operasi</label>
        <button
          onClick={handleModeToggle}
          className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
            isManual
              ? 'bg-purple-50 border-purple-300 hover:bg-purple-100'
              : 'bg-cyan-50 border-cyan-300 hover:bg-cyan-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`${isManual ? 'bg-purple-500' : 'bg-cyan-500'} p-2 rounded-lg`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isManual ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                )}
              </svg>
            </div>
            <span className={`font-bold text-lg ${isManual ? 'text-purple-700' : 'text-cyan-700'}`}>
              {isManual ? 'MANUAL MODE' : 'AUTO MODE'}
            </span>
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-semibold ${
            isManual ? 'bg-purple-200 text-purple-800' : 'bg-cyan-200 text-cyan-800'
          }`}>
            {isManual ? 'Kontrol Manual Aktif' : 'Otomatis Berdasarkan Sensor'}
          </div>
        </button>
      </div>

      {/* Manual Controls */}
      {isManual && (
        <div className="space-y-3 animate-fadeIn">
          <label className="text-sm font-semibold text-gray-700 block">Kontrol Manual</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onManualControl('ON')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>PUMP ON</span>
            </button>
            <button
              onClick={() => onManualControl('OFF')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>PUMP OFF</span>
            </button>
          </div>
        </div>
      )}

      {/* Auto Mode Info */}
      {!isManual && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-cyan-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-cyan-800 mb-1">Mode Otomatis Aktif</p>
              <p className="text-xs text-cyan-700">
                Pompa akan otomatis buang air jika turbidity {'>'} 10 NTU, 
                kemudian otomatis isi air bersih.
              </p>
              <div className="mt-2 text-xs font-medium text-cyan-800">
                Turbidity saat ini: <span className="font-bold">{turbidity.toFixed(2)} NTU</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpControl;
