const fs = require('fs');
const path = require('path');

const OpenAI = require('openai');
const ffmpeg = require('fluent-ffmpeg');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function getAudioDuration(audioFilePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const durationInSeconds = metadata.format.duration;
        resolve(durationInSeconds);
      }
    });
  });
}

export default async function handler(req, res) {
  try {
    const { tts } = req.body;

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: tts,
    });

    // Convert the audio data to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Save the audio file
    const speechFile = path.resolve('public/audio/' + tts + '.mp3');
    await fs.promises.writeFile(speechFile, buffer);

    // const audioFilePath = 'public/audio/' + tts + '.mp3';
    // const audioDurationInSeconds = await getAudioDuration(audioFilePath);

    // console.log('## audioDurationInSeconds: ', audioDurationInSeconds);

    // Estimate word durations
    // const words = tts.split('');

    // Assuming 'tts' contains the text input
    // const totalWords = words.length; // Get the total number of words

    // Estimate the duration of each word
    // const wordDurationInSeconds = audioDurationInSeconds / totalWords;

    res.status(200).json();
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
