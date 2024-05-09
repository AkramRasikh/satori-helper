const satoriContent = 'satoriContent';

const saveContentAPI = async ({ ref, contentEntry }) => {
  const param =
    ref === satoriContent ? '/satori-content-add' : '/update-content';

  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + param;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref,
        contentEntry,
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

export default saveContentAPI;
