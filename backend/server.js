require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Güvenlik başlıkları
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // JSON gövde analizi
app.use(morgan('dev')); // İstek günlüğü (Logging)

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'hackathon26-backend',
    timestamp: new Date().toISOString()
  });
});

// Root Endpoint Placeholder
app.get('/', (req, res) => {
  res.json({
    message: 'hackathon26 Express.js backend is running',
    version: '0.1.0'
  });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

