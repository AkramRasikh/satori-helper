import { NextApiRequest, NextApiResponse } from 'next';
import kuromoji from 'kuromoji';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let tokenizerInstance; // Define a global variable to store the tokenizer instance

async function initializeTokenizer() {
  if (!tokenizerInstance) {
    tokenizerInstance = await new Promise((resolve, reject) => {
      kuromoji
        .builder({ dicPath: 'node_modules/kuromoji/dict' })
        .build((err, tokenizer) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(tokenizer);
        });
    });
  }
  return tokenizerInstance;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { japaneseSentence } = req.body;

  try {
    // Initialize the tokenizer
    const tokenizer = await initializeTokenizer();

    // Tokenize the Japanese sentence
    const tokens = tokenizer.tokenize(japaneseSentence);

    const kuroshiro = new Kuroshiro();
    // Initialize
    // Here uses async/await, you could also use Promise
    await kuroshiro.init(new KuromojiAnalyzer());
    // Convert what you want
    const hasKanji = Kuroshiro.Util.hasKanji;

    // Convert kanji readings to hiragana, leave hiragana and katakana unchanged
    const convertedTokens = await Promise.all(
      tokens.map(async (token) => {
        if (hasKanji(token.surface_form) && token.surface_form) {
          const hiragana = await kuroshiro.convert(token.surface_form, {
            to: 'hiragana',
          });

          token.surface_form = hiragana; // Replace kanji reading with hiragana
        }
        return token;
      }),
    );

    const formedSentence = convertedTokens
      .map((token) => token.surface_form)
      .join('');
    res.json({ formedSentence });
  } catch (error) {
    throw error;
  }
}
