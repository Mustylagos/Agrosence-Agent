const fs = require('fs');
const path = require('path');

class ForecastController {
  getMarketData() {
    const dataPath = path.join(__dirname, '../data/market.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawData);
  }

  calculateForecast(currentPrice, changePercent) {
    let predictedChange = 0;
    let confidence = 'moderate';
    let recommendation = '';

    if (changePercent > 2) {
      predictedChange = changePercent + 1;
      confidence = 'high';
      recommendation = 'Prices are rising. Consider selling soon to maximize profit.';
    } else if (changePercent < -2) {
      predictedChange = changePercent - 1;
      confidence = 'high';
      recommendation = 'Prices are falling. Hold your produce if possible or sell to secure buyers.';
    } else if (changePercent > 0) {
      predictedChange = changePercent + 0.5;
      confidence = 'moderate';
      recommendation = 'Prices are stable with slight upward trend. Good time to sell.';
    } else if (changePercent < 0) {
      predictedChange = changePercent - 0.5;
      confidence = 'moderate';
      recommendation = 'Prices showing slight decline. Monitor market closely.';
    } else {
      predictedChange = 0.5;
      confidence = 'low';
      recommendation = 'Prices are stable. Standard market conditions apply.';
    }

    const forecastPrice = Math.round(currentPrice * (1 + predictedChange / 100));

    return {
      currentPrice,
      forecastPrice,
      predictedChange: predictedChange.toFixed(1),
      confidence,
      recommendation,
      timeframe: 'next 7 days'
    };
  }

  getForecast(req, res) {
    try {
      const { crop, state } = req.query;

      if (!crop || !state) {
        return res.status(400).json({
          success: false,
          error: 'Crop and state parameters are required'
        });
      }

      const marketData = this.getMarketData();
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

      const forecast = this.calculateForecast(cropData.price, cropData.change);
      const buyers = marketData.buyers[cropLower] || [];

      res.json({
        success: true,
        crop,
        state,
        unit: cropData.unit,
        forecast,
        suggestedBuyers: buyers.slice(0, 2),
        dataSource: 'mock'
      });

    } catch (error) {
      console.error('Forecast error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new ForecastController();
