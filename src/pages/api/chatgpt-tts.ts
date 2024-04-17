const fs = require('fs');
const path = require('path');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const tttt = `京子は、ベランダの柵によじ登り、硬直した体でワイシャツを掴んだ。風で飛ばされたかな、と思い、外を見回しても該当するものは見当たらなかった。その時、嫌なことがあると、すぐに泣き喚く子供が玄関へ走っていくのを目撃した。

それ以来、ことあるごとに康平を責ようにな。`;

const speechFile = path.resolve('./siu.mp3');

async function chatGptTTSAPI() {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy',
    input: tttt,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

export default chatGptTTSAPI;
