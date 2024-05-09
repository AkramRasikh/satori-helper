export const getAdditionalSatoriContext = async ({ ref, id }) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/firebase-data-entry';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref,
        id,
      }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseToJSON = await response.json();

    console.log('## responseToJSON: ', responseToJSON);

    return responseToJSON;
  } catch (error) {
    console.log('## loadInContent error: ', error);
  }
};
