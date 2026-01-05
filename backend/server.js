const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apimanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✓ MongoDB connected successfully');
}).catch(err => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

// Import Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const profitRoutes = require('./routes/profit');
const submasterRoutes = require('./routes/submasters');
const transactionRoutes = require('./routes/transactions');
const apiKeyRoutes = require('./routes/apiKeys');
const analyticsRoutes = require('./routes/analytics');
const pricingRoutes = require('./routes/pricing');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/submasters', submasterRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pricing', pricingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
