const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'https://api.airgradient.com',
    secure: true,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': ''
    },
    onProxyReq: function(proxyReq, req, res) {
      console.log('Proxying request to:', proxyReq.path);
    },
    onError: function(err, req, res) {
      console.log('Proxy error:', err.message);
    }
  }
];

module.exports = PROXY_CONFIG;