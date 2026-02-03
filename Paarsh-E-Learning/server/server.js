const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Show connection details
console.log('🔧 Starting Server...');

// Updated CORS configuration with production frontend URL
app.use(cors({
  origin: [
    'https://paarshstudentdashboard.vercel.app', // Your Vercel frontend
    'http://localhost:3000', 
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Health check endpoint - Updated with correct origins
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    mongoConnected: mongoose.connection.readyState === 1,
    time: new Date().toISOString(),
    allowedOrigins: [
      'https://paarshstudentdashboard.vercel.app',
      'http://localhost:3000', 
      'http://localhost:3001'
    ],
    routes: ['/api/auth', '/api/courses', '/api/health', '/api/test'],
    backendUrl: 'https://paarsh-e-learning-4.onrender.com'
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

// Add OPTIONS handling for preflight requests
app.options('*', cors());

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
  console.error('❌ Server Error:', err.stack);
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
    console.log(`🚀 Server running on port: ${PORT}`);
    console.log(`🌐 Public URL: https://paarsh-e-learning-4.onrender.com`);
    console.log(`📊 Health check: https://paarsh-e-learning-4.onrender.com/api/health`);
    console.log('\n✅ Allowed CORS origins:');
    console.log('   - https://paarshstudentdashboard.vercel.app');
    console.log('   - http://localhost:3000');
    console.log('   - http://localhost:3001');
  });
};

startServer();