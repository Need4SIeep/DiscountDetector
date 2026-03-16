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

// Initialize database
try {
  initDB();
} catch (error) {
  console.error('❌ Database initialization error:', error);
  // Don't exit - continue anyway, database might still be usable
}

// Health check routes
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/api/health to check status`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});

module.exports = app;
