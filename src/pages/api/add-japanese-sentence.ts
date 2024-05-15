const japaneseSentences = 'japaneseSentences';

const addJapaneseSentenceAPI = async ({ contentEntry }) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/satori-content-add';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: japaneseSentences,
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
