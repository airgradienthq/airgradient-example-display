// Air Quality Display Application
class AirQualityApp {
    constructor() {
        this.currentDisplayData = null;
        this.loadingDisplayData = false;
        this.apiToken = '';
        this.refreshInterval = null;
        this.stopCurrentRequest = false;
        this.today = new Date();
        this.temperatureUnit = 'celsius'; // 'celsius' or 'fahrenheit'

        // Configuration for air quality color coding
        this.AIR_MEASURE_VALUES_COLORS_CONFIG = {
            pm02: [
                { index: 1, color: 'green', max: 9, label: 'Good' },
                { index: 2, color: 'yellow', max: 35.4, label: 'Moderate' },
                { index: 3, color: 'orange', max: 55.4, label: 'Unhealthy' },
                { index: 4, color: 'red', max: 125.4, label: 'Unhealthy' },
                { index: 5, color: 'purple', max: 225.4, label: 'Very Unhealthy' },
                { index: 6, color: 'brown', max: 10000, label: 'Hazardous' }
            ],
            pi02: [
                { index: 1, color: 'green', max: 50, label: 'Good' },
                { index: 2, color: 'yellow', max: 100, label: 'Moderate' },
                { index: 3, color: 'orange', max: 150, label: 'Unhealthy' },
                { index: 4, color: 'red', max: 200, label: 'Unhealthy' },
                { index: 5, color: 'purple', max: 300, label: 'Very Unhealthy' },
                { index: 6, color: 'brown', max: 500, label: 'Hazardous' }
            ],
            rco2: [
                { index: 1, color: 'green', max: 800, label: 'Excellent' },
                { index: 2, color: 'yellow', max: 1000, label: 'Good' },
                { index: 3, color: 'orange', max: 1500, label: 'Moderate' },
                { index: 4, color: 'red', max: 2000, label: 'Poor' },
                { index: 5, color: 'purple', max: 3000, label: 'Dangerous' },
                { index: 6, color: 'brown', max: 10000, label: 'Hazardous' }
            ],
            tvoc: [
                { index: 1, color: 'green', max: 44, label: 'Very Low' },
                { index: 2, color: 'yellow', max: 111, label: 'Low' },
                { index: 3, color: 'orange', max: 222, label: 'Moderate' },
                { index: 4, color: 'red', max: 2222, label: 'Elevated' },
                { index: 5, color: 'purple', max: 22222, label: 'High' },
                { index: 6, color: 'brown', max: 100000, label: 'Very High' }
            ],
            tvoc_index: [
                { index: 1, color: 'green', max: 150, label: 'Low' },
                { index: 2, color: 'yellow', max: 250, label: 'Moderate' },
                { index: 3, color: 'orange', max: 400, label: 'Elevated' },
                { index: 4, color: 'red', max: 500000, label: 'High' }
            ],
            nox_index: [
                { index: 1, color: 'green', max: 20, label: 'Low' },
                { index: 2, color: 'yellow', max: 150, label: 'Moderate' },
                { index: 3, color: 'orange', max: 300, label: 'Elevated' },
                { index: 4, color: 'red', max: 500000, label: 'High' }
            ],
            heatindex: [
                { index: 1, color: 'green', max: 32, label: 'Good' },
                { index: 2, color: 'yellow', max: 40, label: 'Moderate' },
                { index: 3, color: 'orange', max: 53, label: 'High' },
                { index: 4, color: 'red', max: 1000, label: 'Dangerous' }
            ],
            volt: [
                { index: 1, color: 'red', max: 9, label: 'Critical' },
                { index: 2, color: 'orange', max: 10, label: 'Very Low' },
                { index: 3, color: 'yellow', max: 11, label: 'Low' },
                { index: 4, color: 'green', max: 12.6, label: 'Normal' }
            ]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedApiToken();
        this.loadSavedTemperatureUnit();
        this.updateNoDataVisibility();
        this.updateTemperatureToggleVisibility();
    }

    setupEventListeners() {
        const apiTokenInput = document.getElementById('api-token');
        let debounceTimer;

        apiTokenInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const token = e.target.value.trim();
                if (token.length > 0) {
                    this.apiTokenManagement(token);
                }
            }, 1000);
        });

        apiTokenInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const token = e.target.value.trim();
                if (token.length > 0) {
                    this.apiTokenManagement(token);
                }
            }
        });

        // Temperature unit toggle
        const tempToggle = document.getElementById('temp-toggle');
        tempToggle.addEventListener('click', () => {
            this.toggleTemperatureUnit();
        });
    }

    // Convert PM2.5 to US AQI
    pmToUSAQI(pm02) {
        let result = null;
        if (pm02 == null) {
            result = null;
        } else if (pm02 <= 9.0) {
            result = ((50 - 0) / (9.0 - 0.0) * (pm02 - 0.0) + 0);
        } else if (pm02 <= 35.4) {
            result = ((100 - 51) / (35.4 - 9.1) * (pm02 - 9.1) + 51);
        } else if (pm02 <= 55.4) {
            result = ((150 - 101) / (55.4 - 35.5) * (pm02 - 35.5) + 101);
        } else if (pm02 <= 125.4) {
            result = ((200 - 151) / (125.4 - 55.5) * (pm02 - 55.5) + 151);
        } else if (pm02 <= 225.4) {
            result = ((300 - 201) / (225.4 - 125.5) * (pm02 - 125.5) + 201);
        } else if (pm02 <= 325.4) {
            result = ((500 - 301) / (325.4 - 225.5) * (pm02 - 225.5) + 301);
        } else {
            result = 500;
        }
        if (result !== null && result < 0) {
            result = 0;
        }
        return result !== null ? Number(result.toFixed(1)) : null;
    }

    // Calculate heat index using Rothfusz regression
    calculateRothfuszHeatIndex(tempC, RH) {
        if (tempC == null || RH == null) {
            return { celsius: tempC || 0, fahrenheit: RH || 0 };
        }

        const temperatureF = (tempC * 9/5) + 32;
        let HI;

        // Simple formula for heat index if below 80°F
        let simpleHI = 0.5 * (temperatureF + 61.0 + ((temperatureF - 68.0) * 1.2) + (RH * 0.094));

        // If the simple heat index is 80°F or above, apply full regression equation
        if (simpleHI >= 80) {
            HI = -42.379 +
                2.04901523 * temperatureF +
                10.14333127 * RH -
                0.22475541 * temperatureF * RH -
                0.00683783 * temperatureF * temperatureF -
                0.05481717 * RH * RH +
                0.00122874 * temperatureF * temperatureF * RH +
                0.00085282 * temperatureF * RH * RH -
                0.00000199 * temperatureF * temperatureF * RH * RH;

            // Adjustment for low humidity (RH < 13%) and T between 80°F and 112°F
            if (RH < 13 && temperatureF >= 80 && temperatureF <= 112) {
                let adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(temperatureF - 95)) / 17);
                HI -= adjustment;
            }

            // Adjustment for high humidity (RH > 85%) and T between 80°F and 87°F
            if (RH > 85 && temperatureF >= 80 && temperatureF <= 87) {
                let adjustment = ((RH - 85) / 10) * ((87 - temperatureF) / 5);
                HI += adjustment;
            }
        } else {
            // Apply the simpler formula if the calculated heat index is below 80°F
            HI = simpleHI;
        }

        const heatIndexC = (HI - 32) * 5/9;
        return { celsius: heatIndexC, fahrenheit: HI };
    }

    // Get color by value and measure type
    getColorByValue(value, measure) {
        const config = this.AIR_MEASURE_VALUES_COLORS_CONFIG[measure];
        if (!config) return '';

        config.sort((a, b) => b.index - a.index);
        let color = '';
        config.forEach(configItem => {
            if (value <= configItem.max) {
                color = configItem.color;
            }
        });
        return color;
    }

    // Check if location has available measurements
    measuresAvailable(location) {
        if (!location) return false;

        const measurementFieldsList = [
            'pm02',
            'pi02',
            'rco2',
            'atmp',
            'atmp_fahrenheit',
            'rhum',
            'heatindex'
        ];

        return measurementFieldsList.some(field =>
            location[field] !== null && location[field] !== undefined
        );
    }

    // Check if any location has temperature data
    hasTemperatureData(locations) {
        if (!locations || !Array.isArray(locations)) return false;

        return locations.some(location =>
            this.isNonNullable(location.atmp_corrected, true) ||
            this.isNonNullable(location.heatindex, true)
        );
    }

    // Check if value is non-nullable
    isNonNullable(value, checkForUndefined = false) {
        if (checkForUndefined) {
            return value !== null && value !== undefined && !Number.isNaN(value);
        }
        return value !== null && !Number.isNaN(value);
    }

    // Format number
    formatNumber(value, digits = '1.0-2') {
        if (value === null || value === undefined || Number.isNaN(value)) {
            return '';
        }

        const [minInt, fractionPart] = digits.split('.');
        const [minFraction, maxFraction] = fractionPart.split('-');

        return Number(value).toLocaleString('en-US', {
            minimumIntegerDigits: parseInt(minInt),
            minimumFractionDigits: parseInt(minFraction),
            maximumFractionDigits: parseInt(maxFraction)
        });
    }

    // Format date
    formatDate(dateString, format = 'hh:mm:ss a') {
        const date = new Date(dateString);

        if (format === 'hh:mm:ss a') {
            return date.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } else if (format === 'MM/dd/yyyy') {
            return date.toLocaleDateString('en-US');
        } else if (format === 'yyyy-MM-dd') {
            return date.toISOString().split('T')[0];
        }

        return date.toLocaleString();
    }

    // Show snackbar notification
    showSnackbar(message, duration = 5000) {
        const snackbar = document.getElementById('snackbar');
        snackbar.textContent = message;
        snackbar.classList.add('show');

        setTimeout(() => {
            snackbar.classList.remove('show');
        }, duration);
    }

    // Set loading state
    setLoadingState(loading) {
        this.loadingDisplayData = loading;
        const loadingBar = document.getElementById('loading-bar');

        if (loading) {
            loadingBar.classList.remove('hidden');
        } else {
            loadingBar.classList.add('hidden');
        }
    }

    // API token management
    apiTokenManagement(apiToken) {
        if (!apiToken) return;

        this.apiToken = apiToken;
        localStorage.setItem('airGradientApiToken', apiToken);
        this.startGettingDisplayMeasuresData(apiToken);
    }

    // Load saved API token from localStorage
    loadSavedApiToken() {
        const savedToken = localStorage.getItem('airGradientApiToken');
        if (savedToken) {
            document.getElementById('api-token').value = savedToken;
            this.apiTokenManagement(savedToken);
        }
    }

    // Load saved temperature unit from localStorage
    loadSavedTemperatureUnit() {
        const savedUnit = localStorage.getItem('temperatureUnit');
        if (savedUnit && (savedUnit === 'celsius' || savedUnit === 'fahrenheit')) {
            this.temperatureUnit = savedUnit;
        } else {
            this.temperatureUnit = 'celsius'; // default
        }
        this.updateTemperatureToggleButton();
    }

    // Toggle temperature unit
    toggleTemperatureUnit() {
        this.temperatureUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        localStorage.setItem('temperatureUnit', this.temperatureUnit);
        this.updateTemperatureToggleButton();

        // Re-render current data with new temperature unit
        if (this.currentDisplayData) {
            this.updateDisplay();
        }
    }

    // Update temperature toggle button text
    updateTemperatureToggleButton() {
        const toggleButton = document.getElementById('temp-toggle');
        toggleButton.textContent = this.temperatureUnit === 'celsius' ? '°C' : '°F';
        toggleButton.title = `Switch to ${this.temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`;
    }

    // Update temperature toggle visibility based on available data
    updateTemperatureToggleVisibility() {
        const tempToggle = document.querySelector('.temp-unit-toggle');
        const allLocations = [];

        if (this.currentDisplayData) {
            allLocations.push(...this.currentDisplayData);
        }

        const hasTemperature = this.hasTemperatureData(allLocations);

        if (hasTemperature) {
            tempToggle.classList.remove('hidden');
        } else {
            tempToggle.classList.add('hidden');
        }
    }

    // Convert Celsius to Fahrenheit
    celsiusToFahrenheit(celsius) {
        if (celsius === null || celsius === undefined) return null;
        return (celsius * 9/5) + 32;
    }

    // Convert Fahrenheit to Celsius
    fahrenheitToCelsius(fahrenheit) {
        if (fahrenheit === null || fahrenheit === undefined) return null;
        return (fahrenheit - 32) * 5/9;
    }

    // Get temperature value in selected unit
    getTemperatureInSelectedUnit(tempCelsius) {
        if (tempCelsius === null || tempCelsius === undefined) return null;
        return this.temperatureUnit === 'celsius' ? tempCelsius : this.celsiusToFahrenheit(tempCelsius);
    }

    // Get temperature unit symbol
    getTemperatureUnitSymbol() {
        return this.temperatureUnit === 'celsius' ? '°C' : '°F';
    }

    // Start getting display measures data
    async startGettingDisplayMeasuresData(apiToken) {
        // Stop current request if any
        this.stopCurrentRequest = true;
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        this.stopCurrentRequest = false;

        // Initial request
        await this.fetchDisplayData(apiToken);

        // Set up interval for refreshing data every 2 minutes
        this.refreshInterval = setInterval(async () => {
            if (!this.stopCurrentRequest) {
                await this.fetchDisplayData(apiToken);
            }
        }, 120000); // 120 seconds
    }

    // Detect the correct API URL based on current location
    getApiUrl() {
        // If we're on localhost:3001 (the proxy server), use relative path
        if (window.location.hostname === 'localhost' && window.location.port === '3001') {
            return '/api/public/api/v1/locations/measures/current';
        }
        // Try direct API call first (in case CORS is enabled)
        return 'https://api.airgradient.com/public/api/v1/locations/measures/current';
    }

    // Fetch display data from API - works whether served from proxy or opened directly
    async fetchDisplayData(apiToken) {
        if (this.stopCurrentRequest) return;

        this.setLoadingState(true);

        try {
            const apiUrl = this.getApiUrl();
            console.log(`Attempting API call to: ${apiUrl}`);

            const response = await fetch(`${apiUrl}?token=${encodeURIComponent(apiToken)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    this.showSnackbar('Invalid or expired token. Please refresh your token.');
                    this.stopCurrentRequest = true;
                    this.setLoadingState(false);
                    return;
                }
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API call successful');
            this.currentDisplayData = data;
            this.updateDisplay();
            this.setLoadingState(false);
            return;

        } catch (error) {
            console.error('API call failed:', error.message);

            // Handle CORS errors with helpful suggestions
            if (error.message.includes('CORS') || error.message.includes('blocked') ||
                error.message.includes('fetch') || error.message.includes('NetworkError')) {
                this.showSnackbar('🔒 CORS Error: Try running "node proxy.js" and visit localhost:3001, or use a CORS browser extension');
            } else if (error.message.includes('404')) {
                this.showSnackbar('⚠️ Please run the proxy server: "node proxy.js" then visit http://localhost:3001');
            } else {
                this.showSnackbar(`❌ API Error: ${error.message}`);
            }

            this.setLoadingState(false);
        }
    }



    // Update display with new data
    updateDisplay() {
        if (!this.currentDisplayData) return;

        // Process locations and calculate derived values
        const indoor = this.currentDisplayData.filter(location => location.locationType === 'indoor');
        const outdoor = this.currentDisplayData.filter(location => location.locationType === 'outdoor');

        // Add PM2.5 US AQI calculations
        const processedIndoor = indoor.map(location => {
            location.pi02 = this.pmToUSAQI(location.pm02_corrected);
            this.addHeatIndex(location);
            return location;
        });

        const processedOutdoor = outdoor.map(location => {
            location.pi02 = this.pmToUSAQI(location.pm02_corrected);
            this.addHeatIndex(location);
            return location;
        });

        // Update DOM
        this.renderLocations('indoor-locations', processedIndoor);
        this.renderLocations('outdoor-locations', processedOutdoor);

        // Update section visibility
        this.updateSectionVisibility(processedIndoor, processedOutdoor);
        this.updateNoDataVisibility();
        this.updateTemperatureToggleVisibility();
    }

    // Add heat index to location
    addHeatIndex(location) {
        if (!location.heatindex) {
            const heatIndexMeasures = this.calculateRothfuszHeatIndex(location.atmp, location.rhum);
            location.heatindex = heatIndexMeasures.celsius;
            location.heat_index_fahrenheit = heatIndexMeasures.fahrenheit;
        }
        location.heatindex_clr = this.getColorByValue(location.heatindex, 'heatindex');
    }

    // Render locations in the specified container
    renderLocations(containerId, locations) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        locations.forEach(location => {
            const locationElement = this.createLocationElement(location);
            container.appendChild(locationElement);
        });
    }

    // Create DOM element for a location
    createLocationElement(location) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'measurements spacer-bottom-lg';

        let html = `<h3 class="spacer-bottom-nil">${location.locationName}</h3>`;

        if (this.measuresAvailable(location)) {
            // PM2.5 (μg/m³)
            if (this.isNonNullable(location.pm02_corrected, true)) {
                html += `
                    <div class="main-value">
                        <div class="measurement-icon ${this.getColorByValue(location.pm02_corrected, 'pm02')}"></div>
                        <span class="average-value">${this.formatNumber(location.pm02_corrected)}</span>
                        <div class="value-description">
                            <span class="measure-unit-title">PM<sub>2.5</sub> (μg/m³)</span><br>
                            current
                        </div>
                    </div>
                `;
            }

            // PM2.5 US AQI
            if (this.isNonNullable(location.pi02, true)) {
                html += `
                    <div class="main-value pm-sub-value">
                        <div class="measurement-icon ${this.getColorByValue(location.pi02, 'pi02')}"></div>
                        <span class="average-value">${this.formatNumber(location.pi02)}</span>
                        <div class="value-description">
                            <span class="measure-unit-title">PM<sub>2.5</sub> (US AQI)</span><br>
                            current
                        </div>
                    </div>
                `;
            }

            // CO2
            if (this.isNonNullable(location.rco2_corrected, true)) {
                html += `
                    <div class="measurement">
                        <div class="sub-measurement-icon ${this.getColorByValue(location.rco2_corrected, 'rco2')}"></div>
                        <span>CO<sub>2</sub>: ${this.formatNumber(location.rco2_corrected)}ppm</span>
                    </div>
                `;
            }

            // Temperature (in selected unit)
            if (this.isNonNullable(location.atmp_corrected, true)) {
                const tempValue = this.getTemperatureInSelectedUnit(location.atmp_corrected);
                const tempSymbol = this.getTemperatureUnitSymbol();
                html += `
                    <div class="measurement">
                        <span>Temperature: ${this.formatNumber(tempValue, '1.1-1')}${tempSymbol}</span>
                    </div>
                `;
            }

            // Humidity
            if (this.isNonNullable(location.rhum_corrected, true)) {
                html += `
                    <div class="measurement">
                        <span>Humidity: ${this.formatNumber(location.rhum_corrected, '1.0-0')}%</span>
                    </div>
                `;
            }

            // Heat Index (in selected unit)
            if (this.isNonNullable(location.heatindex, true)) {
                const heatIndexValue = this.getTemperatureInSelectedUnit(location.heatindex);
                const tempSymbol = this.getTemperatureUnitSymbol();
                html += `
                    <div class="measurement">
                        <div class="sub-measurement-icon ${this.getColorByValue(location.heatindex, 'heatindex')}"></div>
                        <span>Heat Index: ${this.formatNumber(heatIndexValue, '1.1-1')}${tempSymbol}</span>
                    </div>
                `;
            }
        } else {
            html += `
                <div>
                    <h4>No Measures Data</h4>
                </div>
            `;
        }

        // Last update timestamp
        const locationTimestamp = new Date(location.timestamp);
        const todayDate = this.formatDate(this.today, 'yyyy-MM-dd');
        const locationDate = this.formatDate(location.timestamp, 'yyyy-MM-dd');

        if (locationDate !== todayDate) {
            html += `
                <div class="last-update">
                    <span>Last Updated: ${this.formatDate(location.timestamp, 'MM/dd/yyyy')}</span>
                </div>
            `;
        } else {
            html += `
                <div class="last-update">
                    <span>Last Update: ${this.formatDate(location.timestamp, 'hh:mm:ss a')}</span>
                </div>
            `;
        }

        locationDiv.innerHTML = html;
        return locationDiv;
    }

    // Update section visibility based on data availability
    updateSectionVisibility(indoorLocations, outdoorLocations) {
        const indoorSection = document.getElementById('indoor-section');
        const outdoorSection = document.getElementById('outdoor-section');

        if (indoorLocations.length > 0) {
            indoorSection.classList.remove('hidden');
        } else {
            indoorSection.classList.add('hidden');
        }

        if (outdoorLocations.length > 0) {
            outdoorSection.classList.remove('hidden');
        } else {
            outdoorSection.classList.add('hidden');
        }
    }

    // Update no data message visibility
    updateNoDataVisibility() {
        const noDataMessage = document.getElementById('no-data-message');
        const noTokenMessage = document.getElementById('no-token-message');
        const noLocationsMessage = document.getElementById('no-locations-message');
        const indoorSection = document.getElementById('indoor-section');
        const outdoorSection = document.getElementById('outdoor-section');

        const hasLocations = !indoorSection.classList.contains('hidden') ||
                           !outdoorSection.classList.contains('hidden');

        if (!hasLocations) {
            noDataMessage.classList.remove('hidden');

            // Show API input field only when there's no API token
            if (this.apiToken) {
                noTokenMessage.classList.add('hidden');
                noLocationsMessage.classList.remove('hidden');
            } else {
                noTokenMessage.classList.remove('hidden');
                noLocationsMessage.classList.add('hidden');
            }
        } else {
            noDataMessage.classList.add('hidden');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AirQualityApp();
});