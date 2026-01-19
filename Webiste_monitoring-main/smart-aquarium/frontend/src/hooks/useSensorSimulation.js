import { useState, useEffect, useCallback } from 'react';

const useSensorSimulation = () => {
  const [sensorData, setSensorData] = useState({
    turbidity: 8.5,
    temperature: 22.5,
    ph: 7.5,
    waterLevel: 85,
  });

  const [chartData, setChartData] = useState({
    turbidity: [],
    temperature: [],
    ph: [],
  });

  const [pumpStatus, setPumpStatus] = useState('OFF');
  const [pumpMode, setPumpMode] = useState('auto');
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [habitatScore, setHabitatScore] = useState(95);

  // Function to generate realistic sensor data with smooth variations
  const generateSensorData = useCallback(() => {
    setSensorData((prev) => {
      // Turbidity - can spike occasionally
      let newTurbidity = prev.turbidity + (Math.random() - 0.5) * 2;
      // Occasionally create a turbidity spike
      if (Math.random() > 0.95) {
        newTurbidity = prev.turbidity + Math.random() * 8;
      }
      newTurbidity = Math.max(1, Math.min(20, newTurbidity));

      // Temperature - stable with small variations
      const newTemperature = prev.temperature + (Math.random() - 0.5) * 0.5;
      const clampedTemp = Math.max(18, Math.min(27, newTemperature));

      // pH - stable with very small variations
      const newPh = prev.ph + (Math.random() - 0.5) * 0.2;
      const clampedPh = Math.max(6.5, Math.min(8.5, newPh));

      // Water level - varies slightly
      let newWaterLevel = prev.waterLevel + (Math.random() - 0.5) * 3;
      newWaterLevel = Math.max(50, Math.min(100, newWaterLevel));

      return {
        turbidity: parseFloat(newTurbidity.toFixed(2)),
        temperature: parseFloat(clampedTemp.toFixed(1)),
        ph: parseFloat(clampedPh.toFixed(2)),
        waterLevel: Math.round(newWaterLevel),
      };
    });
  }, []);

  // Calculate habitat score based on all parameters
  const calculateHabitatScore = useCallback((data) => {
    let score = 100;

    // Turbidity impact (0-40 points)
    if (data.turbidity > 10) score -= 40;
    else if (data.turbidity > 7) score -= 20;
    else if (data.turbidity > 5) score -= 10;

    // Temperature impact (0-30 points)
    if (data.temperature < 20 || data.temperature > 25) score -= 30;
    else if (data.temperature < 21 || data.temperature > 24) score -= 15;

    // pH impact (0-30 points)
    if (data.ph < 7.0 || data.ph > 8.0) score -= 30;
    else if (data.ph < 7.2 || data.ph > 7.8) score -= 15;

    // Water level impact
    if (data.waterLevel < 60 || data.waterLevel > 95) score -= 20;
    else if (data.waterLevel < 70 || data.waterLevel > 90) score -= 10;

    return Math.max(0, Math.min(100, score));
  }, []);

  // Auto pump control logic
  useEffect(() => {
    if (pumpMode === 'auto') {
      if (sensorData.turbidity > 10 && pumpStatus !== 'Buang Air') {
        setPumpStatus('Buang Air');
        addLog({
          type: 'drain',
          action: 'Pompa mulai buang air keruh',
          timestamp: new Date().toLocaleString('id-ID'),
          duration: 'Otomatis'
        });
        addAlert({
          level: 'warning',
          title: 'Air Keruh Terdeteksi',
          message: `Turbidity ${sensorData.turbidity.toFixed(2)} NTU melebihi batas. Pompa otomatis buang air.`,
          timestamp: new Date().toLocaleString('id-ID')
        });

        // Simulate drain and fill cycle
        setTimeout(() => {
          setPumpStatus('Isi Air');
          addLog({
            type: 'fill',
            action: 'Pompa mulai isi air bersih',
            timestamp: new Date().toLocaleString('id-ID'),
            duration: 'Otomatis'
          });

          setTimeout(() => {
            setPumpStatus('OFF');
            setSensorData(prev => ({ ...prev, turbidity: 5 + Math.random() * 2 }));
            addLog({
              type: 'water_change',
              action: 'Pergantian air selesai',
              timestamp: new Date().toLocaleString('id-ID'),
              duration: '5 menit'
            });
            // Remove alert after water change
            setAlerts(prev => prev.filter(a => !a.title.includes('Air Keruh')));
          }, 10000); // Fill for 10 seconds
        }, 15000); // Drain for 15 seconds
      }
    }
  }, [sensorData.turbidity, pumpMode, pumpStatus]);

  // Update chart data
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setChartData((prev) => {
      const maxDataPoints = 20;

      return {
        turbidity: [
          ...prev.turbidity.slice(-maxDataPoints + 1),
          { time: timeStr, value: sensorData.turbidity, Turbidity: sensorData.turbidity }
        ],
        temperature: [
          ...prev.temperature.slice(-maxDataPoints + 1),
          { time: timeStr, value: sensorData.temperature, Temperature: sensorData.temperature }
        ],
        ph: [
          ...prev.ph.slice(-maxDataPoints + 1),
          { time: timeStr, value: sensorData.ph, pH: sensorData.ph }
        ],
      };
    });

    // Update habitat score
    setHabitatScore(calculateHabitatScore(sensorData));

    // Check for critical alerts
    if (sensorData.temperature < 18 || sensorData.temperature > 27) {
      const existingTempAlert = alerts.find(a => a.title.includes('Suhu'));
      if (!existingTempAlert) {
        addAlert({
          level: 'critical',
          title: 'Suhu Air Tidak Ideal',
          message: `Suhu ${sensorData.temperature}°C di luar range ideal (20-25°C). Periksa heater!`,
          timestamp: new Date().toLocaleString('id-ID')
        });
      }
    }

    if (sensorData.ph < 6.8 || sensorData.ph > 8.2) {
      const existingPhAlert = alerts.find(a => a.title.includes('pH'));
      if (!existingPhAlert) {
        addAlert({
          level: 'warning',
          title: 'pH Air Perlu Perhatian',
          message: `pH ${sensorData.ph} mendekati batas. Pertimbangkan untuk menyesuaikan pH air.`,
          timestamp: new Date().toLocaleString('id-ID')
        });
      }
    }

    if (sensorData.waterLevel < 60) {
      const existingLevelAlert = alerts.find(a => a.title.includes('Level Air'));
      if (!existingLevelAlert) {
        addAlert({
          level: 'critical',
          title: 'Level Air Rendah',
          message: `Level air ${sensorData.waterLevel}% terlalu rendah. Segera tambahkan air!`,
          timestamp: new Date().toLocaleString('id-ID')
        });
      }
    }
  }, [sensorData, calculateHabitatScore]);

  // Simulate sensor data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      generateSensorData();
    }, 5000);

    return () => clearInterval(interval);
  }, [generateSensorData]);

  const addLog = (log) => {
    setLogs((prev) => [log, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const addAlert = (alert) => {
    setAlerts((prev) => {
      // Prevent duplicate alerts
      const exists = prev.some(a => a.title === alert.title);
      if (exists) return prev;
      return [alert, ...prev].slice(0, 10); // Keep last 10 alerts
    });
  };

  const handlePumpModeChange = (mode) => {
    setPumpMode(mode);
    addLog({
      type: 'water_change',
      action: `Mode pompa diubah ke ${mode.toUpperCase()}`,
      timestamp: new Date().toLocaleString('id-ID'),
    });
  };

  const handleManualPumpControl = (action) => {
    if (pumpMode === 'manual') {
      if (action === 'ON') {
        setPumpStatus('Isi Air');
        addLog({
          type: 'fill',
          action: 'Pompa dinyalakan manual - Isi Air',
          timestamp: new Date().toLocaleString('id-ID'),
        });
      } else {
        setPumpStatus('OFF');
        addLog({
          type: 'water_change',
          action: 'Pompa dimatikan manual',
          timestamp: new Date().toLocaleString('id-ID'),
        });
      }
    }
  };

  const clearAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    sensorData,
    chartData,
    pumpStatus,
    pumpMode,
    logs,
    alerts,
    habitatScore,
    handlePumpModeChange,
    handleManualPumpControl,
    clearAlert,
  };
};

export default useSensorSimulation;
