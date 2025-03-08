const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Use the newer setupMiddlewares approach to avoid deprecation warnings
  const proxy = createProxyMiddleware({
    target: 'https://www.imsun.org',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      // Log the request for debugging
      console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the response status for debugging
      console.log(`Received response with status: ${proxyRes.statusCode}`);
      
      // Add CORS headers to the response
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Proxy error: ' + err.message);
    }
  });

  app.use('/api', proxy);
};
