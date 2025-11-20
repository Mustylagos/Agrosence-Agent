const express = require('express');
const router = express.Router();
const openaiService = require('../services/openaiService');
const translationService = require('../services/translationService');
const fs = require('fs');
const path = require('path');

let chatStats = {
  totalChats: 0,
  languageCounts: { english: 0, hausa: 0 }
};

router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const language = translationService.detectLanguage(message);
    chatStats.totalChats++;
    chatStats.languageCounts[language]++;

    const messages = [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    let response;
    let enrichedWithData = false;

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('price') || lowerMsg.includes('farashin')) {
      const marketData = getMarketContext();
      response = await openaiService.getChatCompletion(messages, language);
      response += `\n\n${marketData}`;
      enrichedWithData = true;
    } else if (lowerMsg.includes('weather') || lowerMsg.includes('yanayi')) {
      const weatherData = getWeatherContext();
      response = await openaiService.getChatCompletion(messages, language);
      response += `\n\n${weatherData}`;
      enrichedWithData = true;
    } else {
      response = await openaiService.getChatCompletion(messages, language);
    }

    res.json({
      success: true,
      response,
      language,
      dataSource: openaiService.isLive() ? 'azure' : 'mock',
      enrichedWithData
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.get('/stats', (req, res) => {
  res.json({
    success: true,
    stats: chatStats
  });
});

function getMarketContext() {
  try {
    const dataPath = path.join(__dirname, '../data/market.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const marketData = JSON.parse(rawData);

    const kanoMaize = marketData.prices.Kano.maize;
    return `Example: Maize in Kano is currently ₦${kanoMaize.price} per ${kanoMaize.unit}.`;
  } catch {
    return '';
  }
}

function getWeatherContext() {
  try {
    const dataPath = path.join(__dirname, '../data/weather.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const weatherData = JSON.parse(rawData);

    const kanoWeather = weatherData.alerts.Kano;
    return `Example: Weather in Kano is ${kanoWeather.condition}, ${kanoWeather.temperature}. ${kanoWeather.alert}`;
  } catch {
    return '';
  }
}

module.exports = router;
