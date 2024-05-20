export const loadInContent = async ({ ref }) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/firebase-data';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref,
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
