require("dotenv").config();

const { convert } = require("html-to-text");
const fsPromises = require("fs/promises");
const fs = require("fs");
const { generateMp3FromText } = require("./utils/text-to-speech");

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.after", async function ({ results }) {
    const temporaryFolderExists = fs.existsSync(".tmp-mp3/");
    if (!temporaryFolderExists) await fsPromises.mkdir(".tmp-mp3");

    const MP3_CONTENT_JSON_PATH = "_site/mp3-content.json";

    const pagesToGenerate = await fsPromises
      .readFile(MP3_CONTENT_JSON_PATH)
      .then((json) => JSON.parse(json));

    await Promise.all(
      pagesToGenerate.map(async (page) => {
        await generateMp3FromText({
          text: page.content,
          outputFilePath: `_site/${page.fileSlug}.mp3`,
        });
      })
    );

    await fsPromises.rm(".tmp-mp3", { recursive: true });
  });

  eleventyConfig.addCollection("generateMp3", function (collectionApi) {
    return collectionApi.getAll().filter(function (item) {
      // Side-step tags and do your own filtering
      return "generateMp3" in item.data;
    });
  });

  return {
    dir: {
      input: "./src",
    },
    markdownTemplateEngine: "njk",
  };
};
