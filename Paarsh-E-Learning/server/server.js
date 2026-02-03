// server.js - Updated version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Show connection details
console.log('🔧 Starting Server...');

// CORS Configuration - Updated with correct URLs
const allowedOrigins = [
  "https://paarshstudentdashboard.vercel.app",
  "https://paarsh-e-learning-4.onrender.com", // Your actual backend URL
  "http://localhost:3000",
  "http://localhost:3001"
];

// Use CORS middleware with proper configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Additional CORS headers for preflight requests
app.options('*', cors()); // Enable pre-flight across all routes

// Body parsing middleware
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
    allowedOrigins: allowedOrigins,
    routes: ['/api/auth', '/api/courses', '/api/health', '/api/test']
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verify: 'POST /api/auth/verify'
      },
      courses: {
        getAll: 'GET /api/courses',
        getMyCourses: 'GET /api/courses/enrolled/my-courses',
        enroll: 'POST /api/courses/enroll'
      }
    }
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Public URL: https://paarsh-e-learning-4.onrender.com`);
    console.log(`📊 Health check: https://paarsh-e-learning-4.onrender.com/api/health`);
    console.log('\n✅ Allowed origins:');
    allowedOrigins.forEach(origin => {
      console.log(`   - ${origin}`);
    });
  });
};

startServer();