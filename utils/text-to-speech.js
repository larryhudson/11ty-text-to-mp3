const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const { AssetCache } = require("@11ty/eleventy-fetch");
const md5 = require("js-md5");

async function generateAudioBufferFromText({ text }) {
  const textHash = md5(text);

  let cachedMp3 = new AssetCache(textHash);

  if (cachedMp3.isCacheValid("365d")) {
    console.log(`Using cached MP3 data for hash ${textHash}`);
    return cachedMp3.getCachedValue();
  }

  console.log("Asking Microsoft API to generate MP3...");

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.MICROSOFT_TTS_SPEECH_KEY,
    process.env.MICROSOFT_TTS_REGION
  );

  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(
    `.tmp-mp3/tmp-${textHash}.mp3`
  );

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  const audioArrayBuffer = await new Promise((resolve) => {
    synthesizer.speakTextAsync(
      text,
      async (result) => {
        synthesizer.close();
        if (result) {
          // return result as stream
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

async function generateMp3FromText({ text, outputFilePath }) {
  const generatedAudioBuffer = await generateAudioBufferFromText({ text });

  fs.createWriteStream(outputFilePath).write(generatedAudioBuffer);
}

module.exports = {
  generateMp3FromText,
};
