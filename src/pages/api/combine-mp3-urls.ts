import { japanese } from '@/refs';

const combineMP3Urls = async ({ mp3Name, audioFiles, topicName }) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/combine-audio';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
        audioFiles,
        mp3Name,
        topicName,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonRes = await response.json();

    return jsonRes.url;
  } catch (error) {
    console.error('## Error fetching data:', error);
    throw error;
  }
};

export default combineMP3Urls;
