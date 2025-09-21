# International School Bangkok Display Demo

A demonstration display playground for the International School Bangkok (ISB) showcasing air quality monitoring data using public APIs. This Angular application provides a real-time display interface for environmental measurements.

## Overview

This project serves as a demo application for ISB to showcase air quality monitoring capabilities. Instead of using internal APIs, this demo utilizes public APIs to display current environmental measurements in a user-friendly interface.

## Features

- **Real-time Data Display**: Automatically refreshes air quality measurements every 2 minutes
- **Public API Integration**: Uses external public APIs for demonstration purposes
- **Token-based Authentication**: Secure access to measurement data via API tokens
- **Smart Error Handling**: Automatically stops requests on invalid tokens while continuing to retry on network errors
- **User Notifications**: Shows snackbar notifications for authentication errors
- **Responsive Interface**: Built with Angular Material for a modern, responsive design
- **Live Updates**: Real-time data updates without page refresh

## Technology Stack

- **Framework**: Angular 20.3
- **UI Library**: Angular Material (for modern UI components)
- **HTTP Client**: Angular HttpClient for API communication
- **State Management**: RxJS for reactive data flow
- **TypeScript**: 5.9.2

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher (v22 recommended for Angular 20)
- **npm**: v8 or higher (comes with Node.js)
- **Angular CLI**: v20 or higher

> **Note**: Angular 20 requires Node.js v22.12.0 or higher. We recommend using Node.js v24 for optimal performance and compatibility.

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ag-ibs-display-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Navigate to `http://localhost:4200/` in your browser

### Configuration

The application requires an API token to access measurement data. Enter your token when prompted in the application interface.

## API Integration

The application connects to the public API endpoint:
- **Endpoint**: `/api-int/public/api/v1/locations/measures/current`
- **Method**: GET
- **Authentication**: Token-based via query parameter
- **Refresh Interval**: 2 minutes (120 seconds)

## Development

### Development Server

Run `ng serve` for a dev server. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Testing

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

```
src/
├── app/
│   ├── models/           # Data models and interfaces
│   ├── pipes/           # Custom Angular pipes
│   ├── services/        # Data services and API communication
│   └── components/      # Angular components
├── environments/        # Environment configuration
└── assets/             # Static assets
```

## Contributing

This is a demonstration project for ISB. For any questions or modifications, please contact the development team.

## License

This project is for demonstration purposes only.
