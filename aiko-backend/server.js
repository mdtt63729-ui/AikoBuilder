const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories if they don't exist
const dirs = ['uploads', 'workspace', 'output'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Routes
const uploadRoutes = require('./routes/upload');
const buildRoutes = require('./routes/build');
const logsRoutes = require('./routes/logs');
const downloadRoutes = require('./routes/download');

app.use('/api/upload', uploadRoutes);
app.use('/api/build', buildRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/download', downloadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AikoBuilder backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`AikoBuilder backend server listening on port ${PORT}`);
});
