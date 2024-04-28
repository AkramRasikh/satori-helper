const fs = require('fs');
const path = require('path');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handler(req, res) {
  try {
    const { sentence, id } = req.body;

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: sentence,
    });

    const nameToSaveUnder = id || sentence;

    const buffer = Buffer.from(await mp3.arrayBuffer());

    const speechFile = path.resolve('public/audio/' + nameToSaveUnder + '.mp3');
    await fs.promises.writeFile(speechFile, buffer);
    const audioDirectoryPath = path.join(process.cwd(), 'public', 'audio');

    const availableMP3Files = await fs.promises.readdir(audioDirectoryPath);

    res.status(200).json(availableMP3Files);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
