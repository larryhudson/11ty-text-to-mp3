class PodcastInfoJson {
  data() {
    return {
      permalink: `/podcast-info.json`,
    };
  }

  async render(data) {
    return JSON.stringify(
      data.collections.generateMp3.map((mp3Page) => ({
        title: mp3Page.data.title,
        description: mp3Page.data.description,
        date: mp3Page.data.date,
        mp3Url: mp3Page.data.mp3Url,
        mp3UrlWithSite: `https://11ty-text-to-mp3.netlify.app${mp3Page.data.mp3Url}`,
      })),
      null,
      2
    );
  }
}

module.exports = PodcastInfoJson;
