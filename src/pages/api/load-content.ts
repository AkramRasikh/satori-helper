import { japanese } from '@/refs';

export const loadInMultipleContent = async ({ refs }) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/on-load-data';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: japanese,
        refs,
      }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();

    return responseToJSON;
  } catch (error) {
    console.log('## loadInContent error: ', error);
  }
};
