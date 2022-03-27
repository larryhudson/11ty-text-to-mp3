const { convert } = require("html-to-text");

class Mp3ContentJsonFile {
  data() {
    return {
      permalink: "/mp3-content.json",
    };
  }

  render(data) {
    return JSON.stringify(
      data.collections.generateMp3.map((page) => {
        return {
          fileSlug: page.fileSlug,
          content: convert(page.templateContent, { wordwrap: 0 }),
        };
      })
    );
  }
}

module.exports = Mp3ContentJsonFile;
