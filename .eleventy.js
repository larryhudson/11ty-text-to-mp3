require("dotenv").config();

const { convert } = require("html-to-text");
const fsPromises = require("fs/promises");
const fs = require("fs");
const { generateMp3FromText } = require("./utils/text-to-speech");

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("generateMp3", function (collectionApi) {
    return collectionApi.getAll().filter(function (item) {
      // Side-step tags and do your own filtering
      return "mp3Url" in item.data;
    });
  });

  return {
    dir: {
      input: "./src",
    },
    markdownTemplateEngine: "njk",
  };
};
