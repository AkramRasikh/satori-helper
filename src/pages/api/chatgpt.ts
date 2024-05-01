const defaultModel = 'gpt-3.5-turbo';
const chatGptAPI = async ({ sentence, model = defaultModel }) => {
  const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/chat-gpt-text';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence,
        model,
        openAIKey,
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseBody = await response.text();

    const responseParsed = JSON.parse(responseBody);

    return responseParsed;
  } catch (error) {
    console.log('## Error chatGPT to text: ', error);
  }
};

export default chatGptAPI;
