require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("generateMp3", function (collectionApi) {
    return collectionApi.getAll().filter(function (item) {
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
