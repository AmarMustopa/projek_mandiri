/**
 * InfluxDB Service
 * Handles all API calls to InfluxDB v2
 */

const InfluxDBService = {
    // InfluxDB Configuration
    config: {
        url: 'http://103.151.63.80:8099',
        org: 'POLINELA',
        bucket: 'aquarium',
        token: 'NAVV5VsqesiMjfTRDxnC1wPQixvXPXPWlq5ZB33F6B3sv2xR_asMQsfUW4DB58rvmHwxEcj7PClm0c5TlRfKZw==',
        measurement: 'aquarium_status'
    },

    /**
     * Get the latest sensor data from InfluxDB
     */
    async getLatestData() {
        const fluxQuery = `
            from(bucket: "${this.config.bucket}")
                |> range(start: -1h)
                |> filter(fn: (r) => r["_measurement"] == "${this.config.measurement}")
                |> last()
        `;

        try {
            const response = await fetch(`${this.config.url}/api/v2/query?org=${this.config.org}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.config.token}`,
                    'Content-Type': 'application/vnd.flux',
                    'Accept': 'application/json'
                },
                body: fluxQuery
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            return this.parseFluxResponse(data);
        } catch (error) {
            console.error('Error fetching data from InfluxDB:', error);
            throw error;
        }
    },

    /**
     * Parse Flux CSV response to JSON
     */
    parseFluxResponse(csvData) {
        const lines = csvData.trim().split('\n');
        const result = {
            temperature: null,
            ph_raw: null,
            ph_status: null,
            turb_raw: null,
            turb_status: null,
            level_cm: null,
            state: null,
            timestamp: null
        };

        // Skip header lines (lines starting with #)
        const dataLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
        
        if (dataLines.length < 2) {
            console.warn('No data found in InfluxDB response');
            return result;
        }

        // Parse header
        const headers = dataLines[0].split(',');
        const fieldIndex = headers.indexOf('_field');
        const valueIndex = headers.indexOf('_value');
        const timeIndex = headers.indexOf('_time');

        // Parse data rows
        for (let i = 1; i < dataLines.length; i++) {
            const values = dataLines[i].split(',');
            const field = values[fieldIndex];
            const value = values[valueIndex];
            const timestamp = values[timeIndex];

            if (field && value) {
                result[field] = this.parseValue(field, value);
                if (timestamp && !result.timestamp) {
                    result.timestamp = timestamp;
                }
            }
        }

        return result;
    },

    /**
     * Parse value based on field type
     */
    parseValue(field, value) {
        // Numeric fields
        if (['temperature', 'ph_raw', 'turb_raw', 'level_cm'].includes(field)) {
            return parseFloat(value);
        }
        // String fields
        return value.replace(/"/g, ''); // Remove quotes if present
    },

    /**
     * Get historical data for charts (last 24 hours)
     */
    async getHistoricalData(hours = 24) {
        const fluxQuery = `
            from(bucket: "${this.config.bucket}")
                |> range(start: -${hours}h)
                |> filter(fn: (r) => r["_measurement"] == "${this.config.measurement}")
                |> filter(fn: (r) => r["_field"] == "temperature" or r["_field"] == "ph_raw" or r["_field"] == "turb_raw" or r["_field"] == "level_cm")
                |> aggregateWindow(every: 5m, fn: mean, createEmpty: false)
        `;

        try {
            const response = await fetch(`${this.config.url}/api/v2/query?org=${this.config.org}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${this.config.token}`,
                    'Content-Type': 'application/vnd.flux',
                    'Accept': 'application/json'
                },
                body: fluxQuery
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            return this.parseHistoricalData(data);
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw error;
        }
    },

    /**
     * Parse historical data for charts
     */
    parseHistoricalData(csvData) {
        const lines = csvData.trim().split('\n');
        const result = {
            temperature: [],
            ph_raw: [],
            turb_raw: [],
            level_cm: [],
            timestamps: []
        };

        const dataLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
        if (dataLines.length < 2) return result;

        const headers = dataLines[0].split(',');
        const fieldIndex = headers.indexOf('_field');
        const valueIndex = headers.indexOf('_value');
        const timeIndex = headers.indexOf('_time');

        for (let i = 1; i < dataLines.length; i++) {
            const values = dataLines[i].split(',');
            const field = values[fieldIndex];
            const value = parseFloat(values[valueIndex]);
            const timestamp = values[timeIndex];

            if (field && !isNaN(value) && result[field]) {
                result[field].push(value);
                if (!result.timestamps.includes(timestamp)) {
                    result.timestamps.push(timestamp);
                }
            }
        }

        return result;
    },

    /**
     * Test connection to InfluxDB
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.config.url}/ping`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${this.config.token}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('InfluxDB connection test failed:', error);
            return false;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfluxDBService;
}
