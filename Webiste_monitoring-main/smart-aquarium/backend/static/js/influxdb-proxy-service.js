/**
 * InfluxDB Proxy Service
 * Mengambil data dari InfluxDB via Django proxy (menghindari CORS)
 */

const InfluxDBService = {
    baseUrl: '/api/influxdb',

    /**
     * Test koneksi ke InfluxDB
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/test/`);
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ InfluxDB connected');
                return true;
            } else {
                console.error('❌ InfluxDB connection failed');
                return false;
            }
        } catch (error) {
            console.error('❌ InfluxDB error:', error);
            return false;
        }
    },

    /**
     * Ambil data sensor terbaru dari InfluxDB
     */
    async getLatestData() {
        try {
            const response = await fetch(`${this.baseUrl}/latest/`);
            const result = await response.json();
            
            if (result.success && result.data) {
                console.log('📊 InfluxDB data:', result.data);
                return result.data;
            } else {
                console.warn('⚠️ No InfluxDB data available');
                return null;
            }
        } catch (error) {
            console.error('❌ Error fetching InfluxDB data:', error);
            throw error;
        }
    },

    /**
     * Ambil data historis dari InfluxDB
     */
    async getHistoricalData(hours = 24) {
        try {
            const response = await fetch(`${this.baseUrl}/historical/?hours=${hours}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                console.log(`📈 Historical data received (${hours}h):`, result.data.length, 'points');
                return result.data;
            } else {
                console.error('❌ Failed to fetch historical data:', result.error);
                throw new Error(result.error || 'Failed to fetch historical data');
            }
        } catch (error) {
            console.error('❌ Error fetching historical data:', error);
            throw error;
        }
    }
};
