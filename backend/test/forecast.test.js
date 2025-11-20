const forecastController = require('../controllers/forecastController');

describe('Forecast Controller', () => {
  describe('calculateForecast', () => {
    test('predicts price increase when recent change is positive and > 2%', () => {
      const result = forecastController.calculateForecast(45000, 2.5);

      expect(result.currentPrice).toBe(45000);
      expect(result.forecastPrice).toBeGreaterThan(45000);
      expect(parseFloat(result.predictedChange)).toBeGreaterThan(2);
      expect(result.confidence).toBe('high');
      expect(result.recommendation).toContain('rising');
    });

    test('predicts price decrease when recent change is negative and < -2%', () => {
      const result = forecastController.calculateForecast(45000, -2.5);

      expect(result.currentPrice).toBe(45000);
      expect(result.forecastPrice).toBeLessThan(45000);
      expect(parseFloat(result.predictedChange)).toBeLessThan(-2);
      expect(result.confidence).toBe('high');
      expect(result.recommendation).toContain('falling');
    });

    test('predicts moderate increase for small positive change', () => {
      const result = forecastController.calculateForecast(45000, 1.0);

      expect(result.currentPrice).toBe(45000);
      expect(result.forecastPrice).toBeGreaterThan(45000);
      expect(parseFloat(result.predictedChange)).toBeGreaterThan(0);
      expect(parseFloat(result.predictedChange)).toBeLessThan(2);
      expect(result.confidence).toBe('moderate');
    });

    test('predicts moderate decrease for small negative change', () => {
      const result = forecastController.calculateForecast(45000, -1.0);

      expect(result.currentPrice).toBe(45000);
      expect(result.forecastPrice).toBeLessThan(45000);
      expect(parseFloat(result.predictedChange)).toBeLessThan(0);
      expect(parseFloat(result.predictedChange)).toBeGreaterThan(-2);
      expect(result.confidence).toBe('moderate');
    });

    test('handles zero change with low confidence', () => {
      const result = forecastController.calculateForecast(45000, 0);

      expect(result.currentPrice).toBe(45000);
      expect(result.confidence).toBe('low');
      expect(result.recommendation).toContain('stable');
    });

    test('includes timeframe in forecast', () => {
      const result = forecastController.calculateForecast(45000, 2.5);

      expect(result.timeframe).toBe('next 7 days');
    });

    test('rounds forecast price to nearest integer', () => {
      const result = forecastController.calculateForecast(45000, 2.5);

      expect(Number.isInteger(result.forecastPrice)).toBe(true);
    });
  });

  describe('getMarketData', () => {
    test('loads market data successfully', () => {
      const data = forecastController.getMarketData();

      expect(data).toHaveProperty('prices');
      expect(data).toHaveProperty('buyers');
      expect(data.prices).toHaveProperty('Kano');
      expect(data.prices.Kano).toHaveProperty('maize');
    });

    test('market data has required structure', () => {
      const data = forecastController.getMarketData();
      const kanoMaize = data.prices.Kano.maize;

      expect(kanoMaize).toHaveProperty('price');
      expect(kanoMaize).toHaveProperty('unit');
      expect(kanoMaize).toHaveProperty('lastUpdate');
      expect(kanoMaize).toHaveProperty('change');
    });
  });
});
