# AirGradient Display Demo - Plain JavaScript

A demonstration display playground showcasing air quality monitoring data using public APIs. This application provides a real-time display interface for environmental measurements using **plain JavaScript** instead of Angular.

## Overview

This project serves as a demo application to showcase air quality monitoring capabilities. Instead of using internal APIs, this demo utilizes public APIs to display current environmental measurements in a user-friendly interface.

## Features

- **Instant Setup**: Open HTML file directly in browser - no server required!
- **Real-time Data Display**: Automatically refreshes air quality measurements every 2 minutes
- **Public API Integration**: Uses external public API for demonstration purposes - https://api.airgradient.com/public/docs/api/v1/
- **Token-based Authentication**: Secure access to measurement data via API tokens
- **Smart Error Handling**: Automatically stops requests on invalid tokens while continuing to retry on network errors
- **User Notifications**: Shows snackbar notifications for authentication errors
- **Responsive Interface**: Clean, modern design with Material Design inspired styling
- **Live Updates**: Real-time data updates without page refresh
- **Plain JavaScript**: No framework dependencies - runs in any modern browser
- **Temperature Units**: Switch between Celsius and Fahrenheit with precise formatting

## Technology Stack

- **Frontend**: Plain JavaScript (ES6+)
- **Styling**: CSS3 with CSS Grid and Flexbox
- **HTTP Client**: Fetch API for API communication
- **Local Storage**: For API token persistence
- **No Dependencies**: Pure vanilla JavaScript implementation

## Getting Started

### Prerequisites

- **Web Browser**: Any modern browser with ES6+ support
- **No Dependencies**: Zero npm packages required!

### Installation & Running

**Step 1: Clone or download the repository:**
```bash
git clone <repository-url>
cd ag-ibs-display-demo
```

**Step 2: Choose your preferred method:**

**Direct File Opening**
1. Open `index.html` directly in your browser (double-click or drag to browser)
2. Enter your API token and it works immediately!


**That's it!**

### Configuration

The application requires just one step:

1. **Get API Token**: Obtain your token from [AirGradient Connectivity Page](https://app.airgradient.com/settings/place?tab=4)

2. **Enter Token**: Enter your API token in the application interface

The app will automatically try multiple built-in methods to fetch data. 
If browser security restrictions prevent data fetching, 
the app will show simple solutions in the interface.

## If Your API Token Is Invalid

If you're seeing authentication errors or the app isn't loading data, your saved API token may be expired or invalid. To fix this:

1. **Clear your browser's local storage** for this site to remove the old token
2. **Refresh the page**
3. **Enter your new API token** from the [AirGradient Connectivity Page](https://app.airgradient.com/settings/place?tab=4)

### How to Clear Local Storage

- **Chrome/Edge**: Press `F12` → Go to "Application" tab → Click "Local Storage" → Right-click your site → Select "Clear"
- **Firefox**: Press `F12` → Go to "Storage" tab → Click "Local Storage" → Right-click your site → Select "Delete All"
- **Safari**: Press `Option + Command + C` → Go to "Storage" tab → Click "Local Storage" → Right-click your site → Select "Delete"

Alternatively, you can simply clear your browser cache and site data for this page.

## API Integration

The application connects to the public API endpoint:
- **Endpoint**: `https://api.airgradient.com/public/api/v1/locations/measures/current`
- **Method**: GET
- **Authentication**: Token-based via query parameter
- **Refresh Interval**: 2 minutes (120 seconds)

## Project Structure

```
├── index.html          # Main HTML file
├── app.js             # Main application logic
├── styles.css         # All CSS styles
└── README.md          # This file
```

## Key Features Implemented

### Air Quality Measurements
- **PM2.5**: Particulate matter measurements with color-coded indicators
- **US AQI**: Automatic conversion from PM2.5 to US Air Quality Index
- **CO2**: Carbon dioxide levels with quality indicators
- **Temperature**: Both Celsius and Fahrenheit readings
- **Humidity**: Relative humidity percentage
- **Heat Index**: Calculated using Rothfusz regression equation

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color-coded Indicators**: Visual air quality status using standardized color schemes
- **Real-time Updates**: Live data refresh with loading indicators
- **Error Handling**: User-friendly error messages and notifications
- **Token Management**: Persistent API token storage

### Technical Implementation
- **Class-based Architecture**: Clean, maintainable object-oriented code
- **Event-driven Updates**: Efficient DOM updates only when data changes
- **Debounced Input**: Smart token input handling with debouncing
- **Local Storage**: API token persistence across sessions
- **Responsive Error Recovery**: Intelligent retry logic for network errors

## Browser Support
- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 11+ ✅
- Edge 79+ ✅

## Contributing
This is a demonstration project for AirGradient display applications. 
For any questions or modifications, please contact the development team.

## License
This project is for demonstration purposes only.