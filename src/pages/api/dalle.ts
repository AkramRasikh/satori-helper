const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function getDalleImageAPI() {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: '京子は、ベランダの柵によじ登り',
    n: 1,
    size: '1024x1024',
  });
  const image_url = response.data;
  console.log('## image_url: ', image_url);
}

export default getDalleImageAPI;
