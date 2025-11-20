const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

let requestStats = {
  totalRequests: 0,
  cropCounts: {}
};

router.get('/', (req, res) => {
  try {
    const { crop, state } = req.query;

    if (!crop || !state) {
      return res.status(400).json({
        success: false,
        error: 'Crop and state parameters are required'
      });
    }

    const dataPath = path.join(__dirname, '../data/market.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const marketData = JSON.parse(rawData);

    const cropLower = crop.toLowerCase();
    const stateData = marketData.prices[state];

    if (!stateData) {
      return res.status(404).json({
        success: false,
        error: `State "${state}" not found`
      });
    }

    const cropData = stateData[cropLower];

    if (!cropData) {
      return res.status(404).json({
        success: false,
        error: `Crop "${crop}" not found for ${state}`
      });
    }

    requestStats.totalRequests++;
    requestStats.cropCounts[cropLower] = (requestStats.cropCounts[cropLower] || 0) + 1;

    const buyers = marketData.buyers[cropLower] || [];

    res.json({
      success: true,
      crop,
      state,
      price: cropData.price,
      unit: cropData.unit,
      lastUpdate: cropData.lastUpdate,
      change: cropData.change,
      suggestedBuyers: buyers,
      dataSource: 'mock'
    });

  } catch (error) {
    console.error('Market price error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/stats', (req, res) => {
  res.json({
    success: true,
    stats: requestStats
  });
});

module.exports = router;
