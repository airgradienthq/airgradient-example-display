#!/usr/bin/env node

/**
 * Simple CORS Proxy for Air Quality API
 * Pure Node.js - no external dependencies
 *
 * Usage: node proxy.js [port]
 * Default port: 3001
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.argv[2] || 3001;
const API_URL = 'https://api.airgradient.com/public/api/v1/locations/measures/current';

// Simple HTTP server
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    console.log(`${req.method} ${url.pathname}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle API proxy requests
    if (url.pathname.includes('/api/public/api/v1/locations/measures/current')) {
        const token = url.searchParams.get('token');

        if (!token) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Token required' }));
            return;
        }

        // Proxy to real API
        const apiReq = https.get(`${API_URL}?token=${token}`, (apiRes) => {
            res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
            apiRes.pipe(res);
        });

        apiReq.on('error', (error) => {
            console.error('API Error:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API request failed' }));
        });

        return;
    }

    // Serve simple HTML for root
    if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head><title>Air Quality Proxy</title></head>
<body>
    <h1>🌬️ Air Quality Proxy Server</h1>
    <p>✅ Proxy server running on port ${PORT}</p>
    <p>📄 Place your <code>index.html</code> in this folder and visit it here!</p>
    <p>🌐 API: <code>http://localhost:${PORT}/api/public/api/v1/locations/measures/current?token=YOUR_TOKEN</code></p>
</body>
</html>
        `);
        return;
    }

    // Serve static files (basic implementation)
    const fs = require('fs');
    const path = require('path');

    let filePath = path.join(__dirname, url.pathname);

    // Security check
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        // Basic MIME type detection
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json'
        };

        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Simple CORS Proxy running on http://localhost:${PORT}`);
    console.log(`💡 API endpoint: http://localhost:${PORT}/api/public/api/v1/locations/measures/current?token=YOUR_TOKEN`);
    console.log(`📄 Place your HTML/JS/CSS files in this folder to serve them`);
    console.log(`⏹️  Press Ctrl+C to stop`);
});

process.on('SIGINT', () => {
    console.log('\n👋 Stopping proxy server...');
    process.exit(0);
});