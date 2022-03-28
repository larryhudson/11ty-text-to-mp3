// const feed = new Podcast({
//     title: "Eleventy text to speech example",
//     description: "description",
//     feedUrl: "https://11ty-text-to-mp3.netlify.app/podcast.xml",
//     siteUrl: "https://11ty-text-to-mp3.netlify.app",
//     imageUrl: "http://example.com/icon.png",
//     docs: "https://11ty-text-to-mp3.netlify.app",
//     author: "Larry Hudson",
//     managingEditor: "Larry Hudson",
//     webMaster: "Larry Hudson",
//     copyright: "2022 Larry Hudson",
//     language: "en",
//     pubDate: "March 27, 2022 17:14:00 GMT",
//     ttl: 60,
//     itunesAuthor: "Larry Hudson",
//     itunesSubtitle: "Generate MP3 from Eleventy content",
//     itunesSummary: "I am a summary",
//     itunesOwner: { name: "Larry Hudson", email: "larryhudson@hey.com" },
//     itunesExplicit: false,
//     itunesCategory: [
//       {
//         text: "Entertainment",
//       },
//     ],
//     itunesImage: "http://example.com/image.png",
//   });

//   data.collections.generateMp3.forEach((podcastItem) => {
//     const textHash = getTextHashFromHtml(podcastItem.templateContent);
//     const bytesFromCache = new AssetCache(`${textHash}_bytes`);
//     const bytes = bytesFromCache.getCachedValue();

//   });

//   return feed.buildXml();
