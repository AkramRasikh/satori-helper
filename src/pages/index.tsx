import getSentenceAudio from '@/api/audio';
import { satoriPendinghandler } from '../api/pending';
import TopSection from '@/components/TopSection';
import { useRef, useState } from 'react';
import chatGptAPI from './api/chatgpt';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';
import GetContentCTAs from '@/components/GetContentCTAs';
import LoadingStatus from '@/components/LoadingStatus';
import { v4 as uuidv4 } from 'uuid';
import { combinePrompt } from '@/prompts';

export default function Home(props) {
  const sentenceList = props?.satoriData;
  const wordBankRef = useRef([]);
  const [wordBank, setWordBank] = useState([]);
  const [sentenceListState, setSentenceListState] = useState(sentenceList);
  const [wordBankForGeneratedWords, setWordBankForGeneratedWords] = useState(
    [],
  );
  const [response, setResponse] = useState([]);
  const [isLoadingResponse, setLoadingResponse] = useState(false);

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

  const replaceSentence = (responseAfterRemovedSentenceId, newRes) => {
    return response.map((resItem) => {
      const filteredResponse = resItem.response.filter(
        (resItem) => resItem.id !== responseAfterRemovedSentenceId,
      );

      return {
        wordBank: resItem.wordBank,
        response: [...newRes, ...filteredResponse],
      };
    });
  };

  const handleGetNewSentence = async (sentenceToBeReplaced, matchedWords) => {
    try {
      setLoadingResponse(true);
      const prompt =
        combinePrompt +
        matchedWords[0] +
        ' context: ' +
        sentenceToBeReplaced.jap;
      if (!prompt) return;
      const res = await chatGptAPI(prompt);
      const structuredJapEngRes = getStructuredJapEngRes(res);

      const newReplacedResponse = replaceSentence(
        sentenceToBeReplaced.id,
        structuredJapEngRes,
      );

      setResponse(newReplacedResponse);
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const getStructuredJapEngRes = (responseString) => {
    const lines = responseString.split('\n');
    const sentences = [];
    const japaneseRegex = /\[JP\]/;
    const engRegex = /\[EN\]/;

    for (let i = 0; i < lines.length; i++) {
      const sentence = lines[i];
      if (japaneseRegex.test(sentence)) {
        const sentenceObj = {
          id: uuidv4(),
          jap: sentence.replace(japaneseRegex, ''),
          eng: lines[i + 1].replace(engRegex, ''),
        };
        sentences.push(sentenceObj);
      }
    }

    return sentences;
  };

  const deleteSentenceLogic = (sentenceToRemoveId) => {
    return (responseAfterRemovedSentence = response.map((resItem) => {
      const newResponse = resItem.response.filter(
        (nestedRes) => nestedRes.id !== sentenceToRemoveId,
      );
      return {
        wordBank: resItem.wordBank,
        response: newResponse,
      };
    }));
  };

  const handleDeleteSentence = (sentenceToRemoveId) => {
    const responseAfterRemovedSentence =
      deleteSentenceLogic(sentenceToRemoveId);
    setResponse(responseAfterRemovedSentence);
  };

  const deleteWordFromSentenceList = (word) => {
    const newSentenceList = sentenceListState.filter((arr) => arr[1] !== word);
    setSentenceListState(newSentenceList);
  };

  const handleClearWordBank = () => {
    setWordBank([]);
  };

  const handleChatGPTRes = async (prompt, model) => {
    try {
      setLoadingResponse(true);
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
      const res = await chatGptAPI(finalPrompt, model);

      const structuredJapEngRes = getStructuredJapEngRes(res);

      setResponse((prev) => [
        ...prev,
        {
          wordBank: wordBank.map((word) => word.word),
          response: structuredJapEngRes,
        },
      ]);
      setWordBankForGeneratedWords((prev) =>
        Array.from(
          new Set([...prev, ...wordBank.map((wordObj) => wordObj.word)]),
        ),
      );
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <details open>
        <summary>Word list</summary>
        <TopSection
          sentenceList={sentenceListState}
          handleAddToWordBank={handleAddToWordBank}
          wordBankForGeneratedWords={wordBankForGeneratedWords}
          deleteWordFromSentenceList={deleteWordFromSentenceList}
        />
      </details>
      {wordBank?.length > 0 && (
        <WordBankSection
          wordBankRef={wordBankRef}
          wordBank={wordBank}
          handleRemoveFromBank={handleRemoveFromBank}
        />
      )}
      {isLoadingResponse && <LoadingStatus />}
      {wordBank?.length > 0 && (
        <GetContentCTAs
          handleChatGPTRes={handleChatGPTRes}
          isLoadingResponse={isLoadingResponse}
          handleClearWordBank={handleClearWordBank}
        />
      )}
      {response?.length > 0 ? (
        <ResponseSection
          response={response}
          handleDeleteSentence={handleDeleteSentence}
          handleGetNewSentence={handleGetNewSentence}
        />
      ) : null}
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
