const hausaKeywords = [
  'yaya', 'yaushe', 'ina', 'farashin', 'nawa', 'menene', 'za',
  'sannu', 'nagode', 'don', 'yanayi', 'kasuwa', 'amfani',
  'hatsi', 'shinkafa', 'tumatir', 'dawa', 'wake', 'jihar'
];

class TranslationService {
  detectLanguage(text) {
    const lowerText = text.toLowerCase();

    const hausaMatches = hausaKeywords.filter(keyword =>
      lowerText.includes(keyword)
    ).length;

    return hausaMatches >= 1 ? 'hausa' : 'english';
  }

  getStateNames(language = 'english') {
    const stateMapping = {
      english: ['Kano', 'Kaduna', 'Katsina', 'Sokoto', 'Kebbi'],
      hausa: ['Kano', 'Kaduna', 'Katsina', 'Sokoto', 'Kebbi']
    };

    return stateMapping[language] || stateMapping.english;
  }

  getCropNames(language = 'english') {
    const cropMapping = {
      english: {
        maize: 'Maize',
        rice: 'Rice',
        tomato: 'Tomato',
        sorghum: 'Sorghum',
        cowpea: 'Cowpea'
      },
      hausa: {
        maize: 'Hatsi',
        rice: 'Shinkafa',
        tomato: 'Tumatir',
        sorghum: 'Dawa',
        cowpea: 'Wake'
      }
    };

    return cropMapping[language] || cropMapping.english;
  }

  translateResponse(englishText, targetLanguage) {
    if (targetLanguage === 'english') {
      return englishText;
    }

    const basicTranslations = {
      'Hello': 'Sannu',
      'Thank you': 'Nagode',
      'Price': 'Farashin',
      'Market': 'Kasuwa',
      'Weather': 'Yanayi',
      'Good': 'Mai kyau',
      'Today': 'Yau'
    };

    let translated = englishText;
    for (const [eng, hausa] of Object.entries(basicTranslations)) {
      translated = translated.replace(new RegExp(eng, 'gi'), hausa);
    }

    return translated;
  }
}

module.exports = new TranslationService();
