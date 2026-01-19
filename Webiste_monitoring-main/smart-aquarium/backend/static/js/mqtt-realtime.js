// MQTT REAL-TIME DATA FETCHER
// Updated: 2026-01-19 11:25

console.log('[MQTT] Real-Time Service Loaded v4.0');

async function fetchMQTTData() {
    try {
        const response = await fetch('/api/mqtt/latest/');
        const result = await response.json();
        
        console.log('[MQTT] Response:', result);
        
        if (result.success && result.data) {
            updateDashboard(result.data);
        } else {
            console.warn('[MQTT] No data yet');
        }
    } catch (error) {
        console.error('[MQTT] Error:', error);
    }
}

function updateDashboard(data) {
    console.log('[UPDATE] Data:', data);
    
    // Temperature
    if (data.temperature !== null && data.temperature !== undefined) {
        const elem = document.getElementById('temperatureValue');
        if (elem) elem.textContent = data.temperature.toFixed(1);
    }
    
    // pH
    if (data.ph_raw !== null && data.ph_raw !== undefined) {
        const elem = document.getElementById('phValue');
        if (elem) elem.textContent = data.ph_raw.toFixed(2);
    }
    
    // Turbidity
    if (data.turb_raw !== null && data.turb_raw !== undefined) {
        const elem = document.getElementById('turbidityValue');
        if (elem) elem.textContent = data.turb_raw.toFixed(2);
    }
    
    // Water Level
    if (data.level_cm !== null && data.level_cm !== undefined) {
        const percentage = Math.min((data.level_cm / 100) * 100, 100);
        const elem = document.getElementById('waterLevelValue');
        if (elem) elem.textContent = percentage.toFixed(0);
    }
    
    console.log('[UPDATE] Success!');
}

// Start auto-refresh every 2 seconds
setInterval(fetchMQTTData, 2000);

// Initial fetch
setTimeout(fetchMQTTData, 500);
