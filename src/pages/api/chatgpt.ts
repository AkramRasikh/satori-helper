import axios from 'axios';

const defaultModel = 'gpt-3.5-turbo';
const chatGptAPI = async ({ sentence, model = defaultModel }) => {
  const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + '/chat-gpt-text';
  try {
    const response = await axios.post(url, {
      sentence,
      model,
      openAIKey,
    });

    const responseData = response.data;

    const parsedRes = JSON.parse(responseData);
    return parsedRes;
  } catch (error) {
    console.log('## Error chatGPT to text: ', error);
    throw error; // Propagate the error
  }
};

export default chatGptAPI;
