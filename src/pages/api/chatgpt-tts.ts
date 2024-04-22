const fs = require('fs');
const path = require('path');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(req, res) {
  try {
    const { tts, id } = req.body;

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: tts,
    });

    const nameToSaveUnder = id || tts;
    // Convert the audio data to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Save the audio file
    const speechFile = path.resolve('public/audio/' + nameToSaveUnder + '.mp3');
    await fs.promises.writeFile(speechFile, buffer);

    res.status(200).json();
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
