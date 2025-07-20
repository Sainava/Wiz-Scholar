const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string_here') {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
      return true;
    } else {
      console.log('⚠️  MongoDB URI not configured. Running without database connection.');
      console.log('📖 See MONGODB_SETUP.md for setup instructions');
      return false;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('⚠️  Continuing without database connection');
    return false;
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Wiz-Scholar Server is running!' });
});

app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Server is healthy',
    database: mongoStatus,
    timestamp: new Date().toISOString()
  });
});

// Start server (with or without database)
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Visit http://localhost:${PORT} to see the server`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();
