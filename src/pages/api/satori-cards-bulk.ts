const satoriCardsBulkAPI = async () => {
  const sessionToken = process.env.NEXT_PUBLIC_SESSION_TOKEN as string;
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/satori-data-with-fb';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionToken,
        ref: 'satoriContent',
      }),
    });

    const responseToJSON = await response.json();

    const endData = responseToJSON;

    return endData;
  } catch (error) {
    console.error('## Error fetching data:', error);
  }
};

export default satoriCardsBulkAPI;
