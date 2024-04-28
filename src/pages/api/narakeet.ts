import fs from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import got from 'got';

const APIKEY = process.env.NEXT_PUBLIC_NARAKEET_KEY;

const japaneseVoices = [
  'Yuriko',
  'Akira',
  'Kasumi',
  'Kenichi',
  'Tomoka',
  'Takuya',
  'Takeshi',
  'Mariko',
  'Kei',
  // 'Ayami',
  'Hideaki',
  'Kaori',
  'Kenji',
  'Kuniko',
];

const getRandomVoice = () => {
  const randomIndex = Math.floor(Math.random() * japaneseVoices.length);

  const randomJapaneseVoice = japaneseVoices[randomIndex];

  return randomJapaneseVoice;
};

export default async function handler(req, res) {
  const { sentence, id, voice } = req.body;

  const nameToSaveUnder = id || sentence;

  const speechFile = path.resolve('public/audio/' + nameToSaveUnder + '.mp3');

  const voiceSelected = voice || getRandomVoice();

  try {
    await pipeline(
      Readable.from([sentence]),
      got.stream.post(
        `https://api.narakeet.com/text-to-speech/mp3?voice=${voiceSelected}`,
        {
          headers: {
            accept: 'application/octet-stream',
            'x-api-key': APIKEY,
            'content-type': 'text/plain',
          },
        },
      ),
      createWriteStream(speechFile),
    );

    console.log('File saved successfully: ', { sentence, voiceSelected });
    const audioDirectoryPath = path.join(process.cwd(), 'public', 'audio');
    const availableMP3Files = await fs.promises.readdir(audioDirectoryPath);

    res.status(200).json(availableMP3Files);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}
