const { convert } = require("html-to-text");
const { generateAudioBufferFromText } = require("../utils/text-to-speech");

class Testing {
  data() {
    return {
      permalink: (data) => data.pageToGenerate.mp3Url,
      pagination: {
        data: "collections.generateMp3",
        size: 1,
        alias: "pageToGenerate",
      },
    };
  }

  async render(data) {
    return await generateAudioBufferFromText({
      text: convert(data.pageToGenerate.templateContent, { wordwrap: 0 }),
    });
  }
}

module.exports = Testing;
