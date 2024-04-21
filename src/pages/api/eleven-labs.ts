import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

const voiceId = 'pNInz6obpgDQGcFmaJgB';

const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

const headers = {
  Accept: 'audio/mpeg',
  'Content-Type': 'application/json',
  'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
};

// const data = {
//   text: 'でも私、乗はあんまり得意じゃないな',
//   model_id: 'eleven_multilingual_v2',
//   voice_id: voiceId,
//   voice_settings: {
//     stability: 0.5,
//     similarity_boost: 0.5,
//     speaker_boost: true,
//   },
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body),
    })
      .then(async (response) => {
        const audioBlob = await response.blob();
        const buffer = await audioBlob.arrayBuffer();

        fs.writeFile('output4.mp3', Buffer.from(buffer), (err) => {
          if (err) {
            console.error('## Error writing file:', err);
            // res.status(500).json({ error: 'Error writing file' });
          } else {
            console.log('## File downloaded successfully');
            // res.status(200).json({ message: 'File downloaded successfully' });
          }
        });
        res.status(200).end();
      })
      .catch((error) => console.error('Error downloading file:', error));
  } catch (error) {
    res.status(400).end();
  }
}
