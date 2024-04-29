const getKanjiToHiragana = async ({ sentence }) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/kanji-to-hiragana';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sentence,
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonRes = await response.json();
    const hiraganaSentence = jsonRes.sentence;

    return hiraganaSentence;
  } catch (error) {
    throw error;
  }
};

export default getKanjiToHiragana;
