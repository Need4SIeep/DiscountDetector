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
initDB();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/api/health to check status`);
});

module.exports = app;
