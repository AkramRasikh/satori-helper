const updateContentSentence = async ({
  ref,
  sentenceId,
  topicName,
  fieldToUpdate,
  withAudio,
}) => {
  const param = '/update-content-item-correction';

  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + param;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref,
        sentenceId,
        topicName,
        fieldToUpdate,
        withAudio,
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

export default updateContentSentence;

// {
//   "sentenceId": "73b0cd8d-18a3-46de-8f9a-7f0505f3fc7e",
//   "topicName": "zzzy-01",
//   "fieldToUpdate": {
//       "targetLang": "道が左に曲がるのに従ってください",
//       "baseLang": "When the road turns left, keep going until you reach the traffic lights"
//   },
//   "withAudio": true
// }
