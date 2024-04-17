import getSentenceAudio from '@/api/audio';
import { satoriPendinghandler } from '../api/pending';
import TopSection from '@/components/TopSection';
import { useRef, useState } from 'react';
import chatGptAPI from './api/chatgpt';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';

const storyPrompt = `
  Make the following words make sense together in as short few lined 
  story in Japanese. Note the word context is there to help make sense
  of the words
`;

const combinePrompt = `
  I am studying these words. I have given context to them too. Give me simple sentences and ideally combine them where possible. Of course in Japanese. Also if you are using other words, try to make them simple
  I also want them in the format as follows:
  
  [JP] 妹は小さめの靴を履いて、全速力で公園を走っています。
  [EN] My younger sister is wearing small shoes and running at full speed in the park.
`;

export default function Home(props) {
  const sentenceList = props?.satoriData;
  const listRef = useRef([]);
  const wordBankRef = useRef([]);
  const [wordBank, setWordBank] = useState([]);

  const [response, setResponse] = useState([]);

  const handleAddToWordBank = (wordData) => {
    const isWordInWord = wordBank.find(
      (wordObj) => wordObj.word === wordData.word,
    );
    if (!isWordInWord) {
      setWordBank((prev) => [...prev, wordData]);
    }
  };

  const handleRemoveFromBank = (wordToDelete) => {
    const filteredWordBank = wordBank.filter(
      (wordData) => wordData.word !== wordToDelete,
    );

    setWordBank(filteredWordBank);
  };

  const handleClearWordBank = () => {
    setWordBank([]);
  };

  const handleChatGPTRes = async (prompt) => {
    try {
      let finalPrompt;

      if (wordBankRef.current) {
        const elements = wordBankRef.current?.querySelectorAll('*');
        let text = '';
        elements.forEach((element) => {
          text += element.textContent + ' ';
          text = text.replace(/❌/g, '');
        });
        finalPrompt = prompt + text.trim();
      }

      if (!finalPrompt) return;
      const res = await chatGptAPI(finalPrompt);

      setResponse((prev) => [...prev, res]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <TopSection
        sentenceList={sentenceList}
        listRefs={listRef}
        handleAddToWordBank={handleAddToWordBank}
      />
      {wordBank?.length > 0 && (
        <WordBankSection
          wordBankRef={wordBankRef}
          wordBank={wordBank}
          handleRemoveFromBank={handleRemoveFromBank}
          handleClearWordBank={handleClearWordBank}
        />
      )}
      {wordBank?.length > 0 && (
        <div>
          <button onClick={() => handleChatGPTRes(storyPrompt)}>
            Get a story!
          </button>
          <button onClick={() => handleChatGPTRes(combinePrompt)}>
            Combine words
          </button>
        </div>
      )}
      {response?.length > 0 ? <ResponseSection response={response} /> : null}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const satoriData = await satoriPendinghandler();
    const getPathToWord = (inArrIndex) => {
      const thisWordsData = satoriData[inArrIndex];
      const expression = JSON.parse(thisWordsData.expression);

      const textParts =
        expression.paragraphs[0].sentences[0].runs[0].parts[0].parts;

      const textWithKanji = textParts.map((part) => part.text).join('');
      const textZeroKanji = textParts
        .map((part) => part?.reading || part.text)
        .join('');
      return [textWithKanji, textZeroKanji];
    };

    const satoriDataPlus = await Promise.all(
      satoriData.map(async (grandItem, index) => {
        const contexts = grandItem.contexts;

        const firstContext = contexts[0];
        const sentenceId = firstContext.sentenceId;
        const articleCode = firstContext.articleCode;

        const expression = JSON.parse(firstContext.expression);
        const paragraphs = expression.paragraphs;
        const firstNestedParagraph = paragraphs[0];
        const nestedSentences = firstNestedParagraph.sentences;
        const allParts = nestedSentences[0].runs[0].parts;
        const definition = JSON.parse(grandItem.definition).senses[0].glosses;
        const engTranslation = expression.notes[0].discussion;

        const [textWithKanji, textZeroKanji] = getPathToWord(index);

        const audioData = await getSentenceAudio(articleCode, sentenceId);

        return [
          allParts
            .map((item) => {
              if (item.text) {
                return item.text;
              }
              return item?.parts[0].text;
            })
            .join(''),
          textWithKanji,
          textZeroKanji,
          audioData?.url,
          definition,
          engTranslation,
        ];
      }),
    );

    return {
      props: {
        satoriData: satoriDataPlus,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        satoriData: null,
      },
    };
  }
}
