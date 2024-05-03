const underlineTargetWords = async ({ sentence, wordBank }) => {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/underline-target-words';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence,
        wordBank,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const text = await response.text();

    const parsedRed = JSON.parse(text);

    return parsedRed?.underlinedText || [];
  } catch (error) {
    console.error('Error fetching Kuromoji dictionary:', error);
    throw error;
  }
};

export default underlineTargetWords;
