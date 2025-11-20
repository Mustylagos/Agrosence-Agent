class SpeechService {
  constructor() {
    this.isConfigured = false;
  }

  async textToSpeech(text, language = 'en-US') {
    return {
      success: false,
      message: 'Speech synthesis handled by Web Speech API on frontend',
      audioUrl: null
    };
  }

  async speechToText(audioBuffer, language = 'en-US') {
    return {
      success: false,
      message: 'Speech recognition handled by Web Speech API on frontend',
      text: null
    };
  }

  isLive() {
    return this.isConfigured;
  }
}

module.exports = new SpeechService();
