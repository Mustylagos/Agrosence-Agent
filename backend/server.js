require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const marketRoutes = require('./routes/market');
const forecastRoutes = require('./routes/forecast');
const weatherRoutes = require('./routes/weather');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/market-prices', marketRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  const azureConfigured = !!(process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT);

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mode: azureConfigured ? 'live' : 'mock',
    services: {
      azure_openai: azureConfigured,
      market_data: true,
      weather_data: true
    }
  });
});

app.get('/api/config', (req, res) => {
  res.json({
    mode: process.env.AZURE_OPENAI_KEY ? 'live' : 'mock',
    states: ['Kano', 'Kaduna', 'Katsina', 'Sokoto', 'Kebbi'],
    crops: ['maize', 'rice', 'tomato', 'sorghum', 'cowpea']
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🌾 AgroSense Agent backend running on port ${PORT}`);
  console.log(`📊 Mode: ${process.env.AZURE_OPENAI_KEY ? 'LIVE (Azure)' : 'MOCK'}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;
