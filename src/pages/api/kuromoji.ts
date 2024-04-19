import { NextApiRequest, NextApiResponse } from 'next';
import kuromoji from 'kuromoji';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { japaneseSentence, targetWords } = req.body;

  try {
    const tokenizer = await new Promise((resolve, reject) => {
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

    // Tokenize the Japanese sentence
    const tokens = tokenizer.tokenize(japaneseSentence);

    const matchingTokens = tokens.filter((token) => {
      const tokenSurface = token.basic_form || token.surface_form;
      return targetWords.includes(tokenSurface);
    });

    const matchingSurfaceForms = matchingTokens.map(
      (token) => token.surface_form,
    );

    res.send(matchingSurfaceForms);
  } catch (error) {
    console.error('Error in tokenizeJapaneseSentence:', error);
    throw error;
  }
}
