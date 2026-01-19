/**
 * Dashboard Controller
 * Handles real-time data updates and UI rendering
 */

const DashboardController = {
    updateInterval: null,
    refreshRate: 5000, // 5 seconds
    isUpdating: false,

    /**
     * Initialize dashboard
     */
    async init() {
        console.log('🚀 Initializing Dashboard...');
        
        // Load initial data (skip connection test, langsung load data)
        await this.updateDashboard();

        // Start auto-refresh
        this.startAutoRefresh();

        console.log('✅ Dashboard initialized successfully');
    },

    /**
     * Update dashboard with latest data
     */
    async updateDashboard() {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        this.showLoading(true);

        try {
            const data = await InfluxDBService.getLatestData();
            
            if (data) {
                this.updateSensorValues(data);
                this.updateStatusIndicators(data);
                this.updateTimestamp(data.timestamp);
                this.hideError();
            } else {
                this.showError('No data available');
            }
        } catch (error) {
            console.error('Error updating dashboard:', error);
            this.showError('Failed to fetch data: ' + error.message);
        } finally {
            this.isUpdating = false;
            this.showLoading(false);
        }
    },

    /**
     * Update sensor values on dashboard
     */
    updateSensorValues(data) {
        // Temperature
        if (data.temperature !== null && data.temperature !== undefined) {
            this.updateElement('temperatureValue', data.temperature.toFixed(1));
        }

        // pH
        if (data.ph_raw !== null && data.ph_raw !== undefined) {
            this.updateElement('phValue', data.ph_raw.toFixed(2));
        }

        // Turbidity
        if (data.turb_raw !== null && data.turb_raw !== undefined) {
            this.updateElement('turbidityValue', data.turb_raw.toFixed(2));
        }

        // Water Level
        if (data.level_cm !== null && data.level_cm !== undefined) {
            // Calculate percentage (assuming max is 100cm)
            const percentage = Math.min((data.level_cm / 100) * 100, 100);
            this.updateElement('waterLevelValue', percentage.toFixed(0));
        }

        // System State
        if (data.state) {
            this.updateElement('systemState', data.state);
        }
        
        console.log('📊 Sensor values updated:', {
            temperature: data.temperature,
            ph: data.ph_raw,
            turbidity: data.turb_raw,
            level: data.level_cm
        });
    },

    /**
     * Update status indicators (colors and badges)
     */
    updateStatusIndicators(data) {
        // Temperature Status
        const tempStatus = this.getTemperatureStatus(data.temperature);
        this.updateStatusBadge('tempStatus', tempStatus);

        // pH Status
        const phStatusText = data.ph_status || this.getPhStatus(data.ph_raw);
        this.updateStatusBadge('phStatus', phStatusText);

        // Turbidity Status
        const turbStatus = data.turb_status || this.getTurbidityStatus(data.turb_raw);
        this.updateStatusBadge('turbStatus', turbStatus);

        // Water Level Status
        const levelStatus = this.getWaterLevelStatus(data.level_cm);
        this.updateStatusBadge('levelStatus', levelStatus);
    },

    /**
     * Get temperature status
     */
    getTemperatureStatus(temp) {
        if (temp === null) return 'Unknown';
        if (temp >= 20 && temp <= 25) return 'Ideal';
        if (temp >= 18 && temp <= 27) return 'Warning';
        return 'Critical';
    },

    /**
     * Get pH status
     */
    getPhStatus(ph) {
        if (ph === null) return 'Unknown';
        if (ph >= 7.0 && ph <= 8.0) return 'Ideal';
        if (ph >= 6.8 && ph <= 8.2) return 'Warning';
        return 'Critical';
    },

    /**
     * Get turbidity status
     */
    getTurbidityStatus(turb) {
        if (turb === null) return 'Unknown';
        if (turb < 5) return 'Good';
        if (turb < 10) return 'Warning';
        return 'Critical';
    },

    /**
     * Get water level status
     */
    getWaterLevelStatus(level) {
        if (level === null) return 'Unknown';
        if (level >= 70 && level <= 90) return 'Normal';
        if (level > 90) return 'High';
        if (level < 60) return 'Low';
        return 'Warning';
    },

    /**
     * Update status badge with color
     */
    updateStatusBadge(elementId, status) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = status;
        
        // Remove all status classes
        element.classList.remove('status-ideal', 'status-good', 'status-normal', 'status-warning', 'status-critical', 'status-high', 'status-low');
        
        // Add appropriate class
        const statusLower = status.toLowerCase();
        if (['ideal', 'good', 'normal'].includes(statusLower)) {
            element.classList.add('status-ideal');
        } else if (['warning', 'high', 'low'].includes(statusLower)) {
            element.classList.add('status-warning');
        } else if (statusLower === 'critical') {
            element.classList.add('status-critical');
        }
    },

    /**
     * Update element content
     */
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    },

    /**
     * Update timestamp
     */
    updateTimestamp(timestamp) {
        if (!timestamp) return;
        
        const date = new Date(timestamp);
        const formattedTime = date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        this.updateElement('lastUpdate', formattedTime);
    },

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updateDashboard();
        }, this.refreshRate);

        console.log(`Auto-refresh started (every ${this.refreshRate/1000}s)`);
    },

    /**
     * Stop auto-refresh
     */
    stopAutoRefresh() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('Auto-refresh stopped');
        }
    },

    /**
     * Show loading indicator
     */
    showLoading(show) {
        const loader = document.getElementById('dataLoader');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    },

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        console.error(message);
    },

    /**
     * Hide error message
     */
    hideError() {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    },

    /**
     * Manual refresh button handler
     */
    async refreshData() {
        console.log('🔄 Manual refresh triggered');
        await this.updateDashboard();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DashboardController.init();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardController;
}
