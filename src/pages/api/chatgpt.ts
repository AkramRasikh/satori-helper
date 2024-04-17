const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function chatGptAPI(textContent) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: textContent,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const content = completion.choices[0].message.content;
    return content;
  } catch (error) {
    console.log('## Error OpenAI: ', error);
  }
}

export default chatGptAPI;