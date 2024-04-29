const getSatoriAudio = async ({ id, episode }) => {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;

  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/satori-audio';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        episode,
        sessionToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();

    return responseToJSON.url;
  } catch (error) {
    console.log('## Error chatGPT to text: ', error);
  }
};

export default getSatoriAudio;
