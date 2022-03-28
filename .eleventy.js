require("dotenv").config();
const path = require("path");
const fsPromises = require("fs/promises");
const mp3Duration = require("mp3-duration");
const { Podcast } = require("podcast");

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("generateMp3", function (collectionApi) {
    return collectionApi.getAll().filter(function (item) {
      return "mp3Url" in item.data;
    });
  });

  eleventyConfig.on("eleventy.after", async function () {
    // find the podcast-info.json file
    const SITE_OUTPUT_DIR = "_site";
    const PODCAST_INFO_FILENAME = `podcast-info.json`;

    const PODCAST_INFO_FILEPATH = path.join(
      SITE_OUTPUT_DIR,
      PODCAST_INFO_FILENAME
    );

    try {
      const podcastItemsFromJson = await fsPromises
        .readFile(PODCAST_INFO_FILEPATH)
        .then((data) => JSON.parse(data));

      const podcastItems = await Promise.all(
        podcastItemsFromJson.map(async (podcastItem) => {
          const mp3FilePath = path.join(SITE_OUTPUT_DIR, podcastItem.mp3Url);

          const size = await fsPromises
            .stat(mp3FilePath)
            .then((fileStats) => fileStats.size);

          const duration = await mp3Duration(mp3FilePath);

          return {
            ...podcastItem,
            duration,
            size,
          };
        })
      );

      const feed = new Podcast({
        title: "Eleventy text to speech example",
        description: "description",
        feedUrl: "https://11ty-text-to-mp3.netlify.app/podcast.xml",
        siteUrl: "https://11ty-text-to-mp3.netlify.app",
        imageUrl: "http://example.com/icon.png",
        docs: "https://11ty-text-to-mp3.netlify.app",
        author: "Larry Hudson",
        managingEditor: "Larry Hudson",
        webMaster: "Larry Hudson",
        copyright: "2022 Larry Hudson",
        language: "en",
        pubDate: "March 27, 2022 17:14:00 GMT",
        ttl: 60,
        itunesAuthor: "Larry Hudson",
        itunesSubtitle: "Generate MP3 from Eleventy content",
        itunesSummary: "I am a summary",
        itunesOwner: { name: "Larry Hudson", email: "larryhudson@hey.com" },
        itunesExplicit: false,
        itunesCategory: [
          {
            text: "Entertainment",
          },
        ],
        itunesImage: "http://example.com/image.png",
      });

      podcastItems.forEach((podcastItem) => {
        feed.addItem({
          title: podcastItem.title,
          description: podcastItem.description,
          url: podcastItem.mp3UrlWithSite,
          date: podcastItem.date,
          itunesDuration: podcastItem.duration,
          enclosure: {
            url: podcastItem.mp3UrlWithSite,
            size: podcastItem.size,
          },
        });
      });

      const podcastFeedXml = feed.buildXml();

      const PODCAST_FEED_OUTPUT_FILENAME = "/podcast.xml";
      const PODCAST_FEED_OUTPUT_FILEPATH = path.join(
        SITE_OUTPUT_DIR,
        PODCAST_FEED_OUTPUT_FILENAME
      );

      await fsPromises.writeFile(PODCAST_FEED_OUTPUT_FILEPATH, podcastFeedXml);
      await fsPromises.rm(PODCAST_INFO_FILEPATH);
    } catch {}
  });

  return {
    dir: {
      input: "./src",
    },
    markdownTemplateEngine: "njk",
  };
};
