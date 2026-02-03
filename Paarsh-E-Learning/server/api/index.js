const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'https://paarshstudentdashboard.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

// ===== Mongo connection (important for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  return cached.conn;
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ===== routes
const authRoutes = require('../routes/auth');
const courseRoutes = require('../routes/courses');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// ❌ NO app.listen()
// ✅ export handler
module.exports = serverless(app);
