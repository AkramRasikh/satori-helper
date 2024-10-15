import { japanese } from '@/refs';

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
        language: japanese,
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
//   "ref": "japaneseContent",
//   "sentenceId": "03b8aa9c-a9ae-4719-96a2-873ab69f01d7",
//   "topicName": "directions-01",
//   "fieldToUpdate": {
//       "targetLang": "道が左に曲がるところをそのまま進んで、信号まで行ってください"
//   },
//   "withAudio": true
// }
