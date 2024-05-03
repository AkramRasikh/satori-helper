const jsonReturnFormat = [
  {
    targetLang: '妹は小さめの靴を履いて、全速力で公園を走っています.',
    baseLang:
      'My younger sister is wearing small shoes and running at full speed in the park.',
    moodUsed:
      'Insert mood(s) used and explanations where possible (subjunctive, indicative, imperative, conditional, iterrogative and optative mood)',
  },
];

export const storyPrompt = `
  Make the following words make sense together in as short few lined 
  story in Japanese. Note the word context is there to help make sense
  of the words
`;

export const storyPromptFormatted = `
  I have a list of words in Japanese I am learning. I want you to make a short story with the word list below.
  Maximum of a paragraph and have a ratio of ideally at least one target word being used per a sentence.
  Using the words multiple times would be preferred but shouldn't feel forced.
  
  I also want them in the format as follows (Japanese and English translation):

  ${JSON.stringify(jsonReturnFormat)}

  Using the words multiple times is a bonus and in a combined way would be ideal but not a requirement at the expense of comprehension

  List of words:
`;

export const combinePrompt = `
  I am studying these words. I have given context to them too.
  Give me simple sentences and ideally combine them where possible.
  For example if the words plate and dinosaur were in the list, a sentence like "I tried to smash the dinosaurs head with the plate" will suffice.
  Don’t make them very similar to the examples given in the context

  I also want them in the format of an array of objects:
  ${JSON.stringify(jsonReturnFormat)}
`;

export const moodIntensivePrompt = `
  I am studying these words. I have given context to them too.
  Give me simple sentences and ideally combine them where possible.
  For example if the words plate and dinosaur were in the list, a sentence like "I tried to smash the dinosaurs head with the plate" will suffice.
  Don’t make them very similar to the examples given in the context.
  I'd also like a diversity of mood expressions where possible (out of the indicative, subjunctive, imperative, conditional, iterrogative and optative mood)

  Only respond in the below format of JSON as I will parse the response:
  ${JSON.stringify(jsonReturnFormat)}
  `;

export const nonIndicativeIntensivePrompt = `
  I am studying these words. I have given context to them too.
  Give me simple sentences and ideally combine them where possible.
  For example if the words plate and dinosaur were in the list, a sentence like "I tried to smash the dinosaurs head with the plate" will suffice.
  Don’t make them very similar to the examples given in the context.
  I'd also like a diversity of mood expressions where possible (out of the subjunctive, imperative, conditional, iterrogative, optative mood but NOT indicative)

  Only respond in the below format of JSON as I will parse the response:
  ${JSON.stringify(jsonReturnFormat)}
  `;
