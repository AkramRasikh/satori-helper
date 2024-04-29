const getChatGptTTS = async ({ id, sentence }) => {
  const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/chat-gpt-tts';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        sentence,
        openAIKey,
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonRes = await response.json();

    // Parse and return the JSON content of the response
    return jsonRes.mp3FilesOnServer;
  } catch (error) {
    console.log('## Error chatGPT to text: ', error);
  }
};

export default getChatGptTTS;
