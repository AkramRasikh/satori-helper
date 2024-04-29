interface getNarakeetAudioParams {
  id: string;
  sentence: string;
  voice?: string;
}

const getNarakeetAudio = async ({
  id,
  sentence,
  voice,
}: getNarakeetAudioParams) => {
  const apiKey = process.env.NEXT_PUBLIC_NARAKEET_KEY;
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/narakeet-audio';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        sentence,
        voice,
        apiKey,
      }),
    });

    const jsonRes = await response.json();

    // Parse and return the JSON content of the response
    return jsonRes.mp3FilesOnServer;
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

export default getNarakeetAudio;
