const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Show connection details
const uri = process.env.MONGODB_URI;
console.log('🔧 Starting Server...');

// Middleware - Allow both ports
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://paarshstudentdashboard.vercel.app"
  ],
  credentials: true
}));
app.use(cors());

app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses'); // Add this

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes); // Add this

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    mongoConnected: mongoose.connection.readyState === 1,
    time: new Date().toISOString(),
    allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Courses API: http://localhost:${PORT}/api/courses`);
    console.log('\n✅ Ready for frontend connections from:');
    console.log('   - http://localhost:3000');
    console.log('   - http://localhost:3001');
  });
};

startServer();