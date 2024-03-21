import axios from 'axios';

export default async function getSentenceAudio(episode, id) {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;

  try {
    const apiResponse = await axios.get(
      `https://www.satorireader.com/api/audio-clips/sentences/inline/${episode}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SessionToken=${sessionToken}`,
        },
      },
    );

    return apiResponse.data.result;
  } catch (error) {
    console.error('## Error fetching data:', error);
  }
}
