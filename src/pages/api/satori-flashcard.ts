const handleSatoriFlashcardAPI = async ({ flashCardDifficulty, cardId }) => {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;

  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/satori-flashcard';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flashCardDifficulty,
        cardId,
        sessionToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonRes = await response.json();

    return jsonRes;
  } catch (error) {
    console.error('## Error fetching data:', error);
    throw error;
  }
};

export default handleSatoriFlashcardAPI;
