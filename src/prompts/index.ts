const jsonReturnFormat = [
  {
    targetLang: '妹は小さめの靴を履いて、全速力で公園を走っています.',
    baseLang:
      'My younger sister is wearing small shoes and running at full speed in the park.',
    moodUsed:
      'Insert mood(s) used and explanations where possible (subjunctive, indicative, imperative, conditional, iterrogative and optative mood)',
  },
  {
    targetLang: 'そうだな、じゃあレンタカーでも借りて、箱根にでも行こう.',
    baseLang: "I know, then let's rent a car and go to Hakone",
    moodUsed:
      'Insert mood(s) used and explanations where possible (subjunctive, indicative, imperative, conditional, iterrogative and optative mood)',
  },
];

const jsonReturnFormatWithNotes = [
  {
    targetLang: 'そうだな、じゃあレンタカーでも借りて、箱根にでも行こう.',
    baseLang: "I know, then let's rent a car and go to Hakone",
    notes:
      'In this sentence, "じゃあ" is best understood as an informal equivalent to a “well then” in order to follow up with a suggestion for example',
  },
  {
    targetLang:
      '税関職員は僕をボックスの上に立たせて身体検査を行い、髪の毛の中まで手を入れて何かないか確認しました。',
    baseLang:
      'The customs officer made me stand on a box and searched me. He even put his hands in my hair to check for anything',
    notes:
      "In this sentence, 'made me stand on a box' is translated as '僕をボックスの上に立たせて', which carries the connotation of being compelled or forced to stand on a box. 'he even put his hands in my hair' is translated as '髪の毛の中まで手を入れて', indicating the thoroughness of the search. The phrase 'check for anything' is generalised as '何かないか確認しました', which could refer to anything unusual or out of place.",
  },
];

export const storyPrompt = `
  I have a list of words in Japanese I am learning. I want you to make a short story with the word list below.
  Maximum of a paragraph and have a ratio of ideally at least one target word being used per a sentence.
  Using the words multiple times would be preferred but shouldn't feel forced.
  
  I also want them in the format as follows (Japanese and English translation):

  ${JSON.stringify(jsonReturnFormat)}

  Using the words multiple times is a bonus and in a combined way would be ideal but not a requirement at the expense of comprehension

  List of words:
`;

const moodPlus = `
I'd also like a diversity of mood expressions where possible (out of the indicative, subjunctive, imperative, conditional, iterrogative and optative mood).
`;

export const dialoguePrompt = `
  I have a list of words in Japanese I am learning. I want you to make a short dialogue with the word list below.
  I want a ratio of ideally at least one target word being used per a sentence.
  Using the words multiple times would be preferred but shouldn't feel forced.
  ${moodPlus}
  
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

// export const thoughtsToBilingualText = `
//   Translate in a way that is palatable to the Japanese language while still maintaining the meaning in to Japanese with bilingual text (with English) in Json format with each separate sentence.
//   I want it to sound like a natural speaking style.
//   I want properties targetLang, baseLang and notes.

//   The property ‘notes’ for each line that is there to explain any nuisance linguistic difference that may require explanation.

//   Only respond in the below format of JSON as I will parse the response:

//   ${JSON.stringify(jsonReturnFormatWithNotes)}
// `;

export const thoughtsToBilingualText = `
  Here is some English text. Translate the entire text into Japanese so that it sounds natural. Do not do like for like translations if it doesn’t make sense. The main thing is fundamental meaning being conveyed in the totally of the entire base text. Therefore override my base language text where necessary and preferred if it makes sense in Japanese. Where more comprehensible, swap out of the orders, combine sentences, etc.

  I want properties targetLang, baseLang and notes.
  The property ‘notes’ for each line that is there to explain any nuisance linguistic difference that may require explanation.

  For example, the sentence “He taught me the value of competing against yourself and to never stop striving to be better" may “translate well into “彼は自分自身と競う価値と、決して良くなることを止めないことを私に教えてくれた" 

  But a more refined and natural one like “彼は自分自身と競うことの価値と、決して成長を止めないことを私に教えてくれた“ is preferable. And you can add why its preferable in the "notes" section
  Only respond in the below format of JSON as I will parse the response:

  ${JSON.stringify(jsonReturnFormatWithNotes)}
`;

export const japaneseTextNoJapanaeseNeeded = `
  Given the JSON below "Theme of text", I want you to translate the into english where it doesn't have a corresponding 'baseLang' property.

  I want properties targetLang, baseLang and notes.
  The property ‘notes’ for each line that is there to explain any nuisance linguistic difference that may require explanation.
  Only respond in the below format of JSON as I will parse the response:

  ${JSON.stringify(jsonReturnFormatWithNotes)}
`;
