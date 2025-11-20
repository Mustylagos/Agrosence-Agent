const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        error: 'State parameter is required'
      });
    }

    const dataPath = path.join(__dirname, '../data/weather.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const weatherData = JSON.parse(rawData);

    const stateWeather = weatherData.alerts[state];

    if (!stateWeather) {
      return res.status(404).json({
        success: false,
        error: `Weather data for "${state}" not found`
      });
    }

    res.json({
      success: true,
      state,
      weather: stateWeather,
      dataSource: 'mock'
    });

  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
