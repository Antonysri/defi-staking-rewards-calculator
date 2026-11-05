const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/api', require('./server/routes/api/staking'));
app.use('/api/users', require('./server/routes/api/users'));
app.use('/api/auth', require('./server/routes/api/auth'));
app.use('/api/profile', require('./server/routes/api/profile'));
app.use('/api/posts', require('./server/routes/api/posts'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware (Requirement: ensures unexpected failures return 500 without crashing)
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5025;

if (require.main === module) {
  app.listen(PORT, () => console.log(`DeFi Staking Server running on port ${PORT}`));
}

module.exports = app;
