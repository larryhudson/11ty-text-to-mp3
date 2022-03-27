const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { AssetCache } = require("@11ty/eleventy-fetch");
const md5 = require("js-md5");
const { convert } = require("html-to-text");

async function convertHtmlToPlainText(html) {
  return convert(html, { wordwrap: 0 });
}

async function convertHtmlToAudio(html) {
  const text = await convertHtmlToPlainText(html);
  const textHash = md5(text);

  let cachedMp3 = new AssetCache(textHash);

  if (cachedMp3.isCacheValid("365d")) {
    console.log(`Using cached MP3 data for hash ${textHash}`);
    return cachedMp3.getCachedValue();
  } else {
    console.log(`Asking Microsoft API to generate MP3 for hash ${textHash}`);
  }

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.MICROSOFT_TTS_SPEECH_KEY,
    process.env.MICROSOFT_TTS_REGION
  );

  speechConfig.speechSynthesisLanguage = "en-AU";
  speechConfig.speechSynthesisVoiceName = "en-AU-WilliamNeural";
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  if (!fs.existsSync(".tmp-mp3")) await fsPromises.mkdir(".tmp-mp3");

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(
    `.tmp-mp3/${textHash}.mp3`
  );

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  const audioArrayBuffer = await new Promise((resolve) => {
    synthesizer.speakTextAsync(
      text,
      async (result) => {
        synthesizer.close();
        if (result) {
          resolve(result.privAudioData);
        }
      },
      (error) => {
        console.log(error);
        synthesizer.close();
      }
    );
  });

  const audioBuffer = Buffer.from(audioArrayBuffer);

  await cachedMp3.save(audioBuffer, "buffer");
  return audioBuffer;
}

module.exports = {
  convertHtmlToAudio,
  convertHtmlToPlainText,
};
