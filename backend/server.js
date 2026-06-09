require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const superAdminRoutes = require('./routes/superadmin.routes');
const deptHeadRoutes = require('./routes/depthead.routes');
const citizenRoutes = require('./routes/citizen.routes');
const supervisorRoutes = require('./routes/supervisor.routes');

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup to allow session cookies from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if using https
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/depthead', deptHeadRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/supervisor', supervisorRoutes);

// Ye line frontend ko backend images access karne degi
app.use('/uploads', express.static('uploads'));

// Base Route
app.get('/', (req, res) => {
  res.send('AI Grievance System API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});