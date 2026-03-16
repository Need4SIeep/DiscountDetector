// Load environment variables from .env file if available (dev only)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not required - Railway and most hosting services set env vars directly
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const { initDB } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Health check routes (available before DB init)
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cost Tracker API is running',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cost Tracker API is running' });
});

// Initialize database asynchronously
console.log('🔧 Initializing database...');
try {
  initDB();
  console.log('✓ Database initialization started');
} catch (error) {
  console.error('❌ Database initialization error:', error);
  // Continue anyway - database might be accessible despite init errors
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware (catch all errors)
app.use((err, req, res, next) => {
  console.error('❌ Route error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error' 
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with proper error handling
let server;
try {
  server = app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Visit http://localhost:${PORT}/api/health to check status`);
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
    }
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}

// Handle process signals gracefully
process.on('SIGTERM', () => {
  console.log('📍 SIGTERM received - shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('📍 SIGINT received - shutting down');
  if (server) {
    server.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  // Don't exit - try to keep running
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  // Don't exit - try to keep running
});

module.exports = app;
