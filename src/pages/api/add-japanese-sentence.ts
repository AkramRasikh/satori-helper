import { japanese, sentences } from '@/refs';

const addJapaneseSentenceAPI = async ({ contentEntry }) => {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/add-my-generated-content';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
        ref: sentences,
        contentEntry,
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return true;
  } catch (error) {
    console.log('## Error chatGPT to text: ', error);
  }
};

export default addJapaneseSentenceAPI;
