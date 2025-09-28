# AirGradient Display Demo - Plain JavaScript

A demonstration display playground showcasing air quality monitoring data using public APIs. This application provides a real-time display interface for environmental measurements using **plain JavaScript** instead of Angular.

## Overview

This project serves as a demo application to showcase air quality monitoring capabilities. Instead of using internal APIs, this demo utilizes public APIs to display current environmental measurements in a user-friendly interface.

## Features

- **Instant Setup**: Open HTML file directly in browser - works immediately with proxy server
- **Smart URL Detection**: Automatically detects whether opened as file or served from proxy
- **Real-time Data Display**: Automatically refreshes air quality measurements every 2 minutes
- **Public API Integration**: Uses external public APIs for demonstration purposes
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
- **Node.js** (optional): For the best experience with built-in CORS proxy
- **No Dependencies**: Zero npm packages required!

### Installation & Running

**Step 1: Clone or download the repository:**
```bash
git clone <repository-url>
cd ag-ibs-display-demo
```

**Step 2: Choose your preferred method:**

**Method 1: Direct File Opening (Recommended)**
1. Start the proxy server: `node proxy.js`
2. Open `index.html` directly in your browser (double-click or drag to browser)
3. Enter your API token and it works immediately!

**Method 2: Traditional Server Access**
1. Run the proxy server: `node proxy.js`
2. Visit: `http://localhost:3001`
3. Enter your API token

**That's it!** The app automatically detects how it's being accessed and connects to the proxy server. No CORS issues, no complex setup.

### Configuration

The application requires just one step:

1. **Get API Token**: Obtain your token from [AirGradient Connectivity Page](https://app.airgradient.com/settings/place?tab=4)

2. **Enter Token**: Enter your API token in the application interface

The app will automatically try multiple built-in methods to fetch data. If browser security restrictions prevent data fetching, the app will show simple solutions in the interface.

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
├── proxy.js           # Node.js CORS proxy server
├── package.json       # Project configuration
├── test.html          # Test suite
├── README.md          # This file
└── .gitignore         # Git ignore file
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

## Migration from Angular

This application was converted from an Angular 20 application to plain JavaScript while maintaining:
- ✅ All original functionality
- ✅ Same UI/UX design
- ✅ Same API integration
- ✅ Same error handling
- ✅ Same responsive behavior
- ✅ Same performance characteristics

### Key Differences
- **No Framework Dependencies**: Removed Angular, RxJS, Angular Material
- **Reduced Bundle Size**: From ~2MB to ~15KB total
- **Faster Loading**: No framework initialization overhead
- **Browser Compatibility**: Works in any ES6+ browser
- **Simpler Deployment**: Just static files, no build process required

## Browser Support

- Chrome 60+ ✅
- Firefox 55+ ✅
- Safari 11+ ✅
- Edge 79+ ✅

## Development

### Making Changes

1. Edit `app.js` for application logic
2. Edit `styles.css` for styling
3. Edit `index.html` for structure
4. **Just refresh browser to see changes instantly!**

### Testing

- Open `test.html` in your browser to run the test suite
- Open developer console to see any JavaScript errors or network issues
- The application includes comprehensive error handling and logging

## Contributing

This is a demonstration project for AirGradient display applications. For any questions or modifications, please contact the development team.

## License

This project is for demonstration purposes only.