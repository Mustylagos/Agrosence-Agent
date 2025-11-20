const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiKey = process.env.AZURE_OPENAI_KEY;
    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    this.deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini';
    this.isConfigured = !!(this.apiKey && this.endpoint);
  }

  async getChatCompletion(messages, language = 'english') {
    if (!this.isConfigured) {
      return this.getMockResponse(messages[messages.length - 1].content, language);
    }

    try {
      const url = `${this.endpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=2024-02-15-preview`;

      const systemPrompt = {
        role: 'system',
        content: `You are AgroSense, an intelligent assistant for smallholder farmers in Northern Nigeria.
        Keep answers short, actionable, and in ${language === 'hausa' ? 'Hausa' : 'English'}.
        Always give simple recommendations and price forecasts in local terms (e.g., price per 100kg bag, per basket).
        Focus on practical advice about market prices, weather conditions, planting times, and buyer connections.
        Be friendly, respectful, and use local context (Northern Nigeria agricultural practices).
        When discussing prices, use Naira (₦) and local market terms.`
      };

      const response = await axios.post(
        url,
        {
          messages: [systemPrompt, ...messages],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Azure OpenAI error:', error.message);
      return this.getMockResponse(messages[messages.length - 1].content, language);
    }
  }

  getMockResponse(userMessage, language) {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('price') || lowerMsg.includes('farashin') || lowerMsg.includes('market')) {
      if (language === 'hausa') {
        return 'Sannu! Na iya taimaka maka da farashin amfanin gona. Ka tambaye ni game da hatsi, shinkafa, tumatir, dawa, ko wake. Ina jihar da kake?';
      }
      return 'Hello! I can help you with crop prices. Ask me about maize, rice, tomato, sorghum, or cowpea. Which state are you in?';
    }

    if (lowerMsg.includes('weather') || lowerMsg.includes('yanayi')) {
      if (language === 'hausa') {
        return 'Yanayin yau yana da kyau don noma. Ka tambaye ni game da jihar ka don samun cikakken bayani.';
      }
      return 'Current weather conditions are favorable for farming. Ask me about your specific state for detailed information.';
    }

    if (lowerMsg.includes('buyer') || lowerMsg.includes('mai saye')) {
      if (language === 'hausa') {
        return 'Zan iya nuna maka masu siyan amfanin gona a yankinku. Wane irin amfani kake so ka sayar?';
      }
      return 'I can show you buyers for your crops. What crop would you like to sell?';
    }

    if (language === 'hausa') {
      return 'Sannu! Ina AgroSense. Zan iya taimaka maka da farashin kasuwa, yanayi, da shawarwarin noma. Menene bukatarka?';
    }

    return 'Hello! I am AgroSense, your agricultural advisor. I can help with market prices, weather alerts, and farming recommendations. What would you like to know?';
  }

  isLive() {
    return this.isConfigured;
  }
}

module.exports = new OpenAIService();
