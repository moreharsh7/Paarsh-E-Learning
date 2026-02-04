const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Show connection details
console.log('🔧 Starting Server...');

// CORS configuration
const corsOptions = {
  origin: [
    'https://paarshstudentdashboard.vercel.app',
    'http://localhost:3000', 
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware - This handles OPTIONS automatically
app.use(cors(corsOptions));

// OR if you need explicit OPTIONS handling, use regex:
// app.options(/.*/, cors(corsOptions));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    mongoConnected: mongoose.connection.readyState === 1,
    time: new Date().toISOString(),
    allowedOrigins: [
      'https://paarshstudentdashboard.vercel.app',
      'http://localhost:3000', 
      'http://localhost:3001'
    ]
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || "https://paarshstudentdashboard.vercel.app";
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log('\n✅ Allowed CORS origins:');
    console.log('   - https://paarshstudentdashboard.vercel.app');
    console.log('   - http://localhost:3000');
    console.log('   - http://localhost:3001');
  });
};

startServer();
