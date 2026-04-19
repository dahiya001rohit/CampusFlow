const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const bookingRoutes = require('./routes/bookings');
const complaintRoutes = require('./routes/complaints');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ message: 'CampusFlow API running' }));

// Serve frontend in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => res.json({ message: 'CampusFlow API running in dev mode' }));
}

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusflow';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
