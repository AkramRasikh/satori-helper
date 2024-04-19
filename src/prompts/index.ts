export const storyPrompt = `
  Make the following words make sense together in as short few lined 
  story in Japanese. Note the word context is there to help make sense
  of the words
`;

export const combinePrompt = `
  I am studying these words. I have given context to them too.
  Give me simple sentences and ideally combine them where possible.
  For example if the words plate and dinosaur were in the list, a sentence like "I tried to smash the dinosaurs head with the plate" will suffice.
  Don’t make them very similar to the examples given in the context

I also want them in the format as follows (Japanese and English translation):
  [JP] 妹は小さめの靴を履いて、全速力で公園を走っています。
  [EN] My younger sister is wearing small shoes and running at full speed in the park.
`;
