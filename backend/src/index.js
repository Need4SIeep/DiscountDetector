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
const { initDB, getDB } = require('./models/database');

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

// Initialize database and start server
console.log('🔧 Initializing database...');
try {
  initDB();
  console.log('✓ Database initialization started');
  
  // Small delay to ensure database operations queue is set up
  setTimeout(() => {
    startServer();
  }, 500);
} catch (error) {
  console.error('❌ Database initialization error:', error);
  startServer(); // Start server anyway - database might be accessible
}

// Function to start the server
function startServer() {
  let server;
  try {
    server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Visit http://localhost:${PORT}/api/health to check status`);
      console.log('✓ Application ready to accept requests');
      
      // Keep the server process alive
      process.on('beforeExit', (code) => {
        console.log('📍 Process about to exit with code:', code);
      });
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      }
    });

    // Expose server globally for signal handlers
    global.server = server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle process signals gracefully
process.on('SIGTERM', () => {
  console.log('📍 SIGTERM received - shutting down gracefully');
  const server = global.server;
  if (server) {
    server.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
    // Force exit after 10 seconds
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('📍 SIGINT received - shutting down');
  const server = global.server;
  if (server) {
    server.close(() => {
      console.log('✓ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
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
