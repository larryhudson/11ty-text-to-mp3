const { convertHtmlToAudio } = require("../utils/text-to-speech");

class TextToSpeechMp3 {
  data() {
    return {
      permalink: (data) => data.mp3Page.data.mp3Url,
      pagination: {
        data: "collections.generateMp3",
        size: 1,
        alias: "mp3Page",
      },
    };
  }

  async render(data) {
    return await convertHtmlToAudio(data.mp3Page.templateContent);
  }
}

module.exports = TextToSpeechMp3;
