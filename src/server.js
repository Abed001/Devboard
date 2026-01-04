require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const goalRoutes = require('./routes/goals');
const githubRoutes = require('./routes/github'); // ← Add this


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://devboard-client-zqwd.onrender.com', "http://localhost:5173"]
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DevBoard API is running!' });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/github', githubRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});