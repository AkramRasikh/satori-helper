import getSentenceAudio from '@/api/audio';
import { satoriReviewhandler } from '../api/pending';
import LearningBase from '@/components/LearningBase';
import { useRef, useState } from 'react';
import chatGptAPI from './api/chatgpt';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';
import GetContentActions from '@/components/GetContentCTAs';
import LoadingStatus from '@/components/LoadingStatus';
import { v4 as uuidv4 } from 'uuid';
import { combinePrompt } from '@/prompts';
import '../app/styles/globals.css';

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
  const [mp3Bank, setMp3Bank] = useState([]);

  const handleAddToWordBank = (wordData) => {
    const isWordInWord = wordBank.find(
      (wordObj) => wordObj.word === wordData.word,
    );
    if (!isWordInWord) {
      setWordBank((prev) => [...prev, wordData]);
    }
  };

  const handleFlashCard = async (flashCardNumber, cardId) => {
    try {
      setLoadingResponse(true);
      await fetch('/api/satori-flashcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashCardNumber,
          cardId,
        }),
      });
      setSentenceListState((prev) =>
        prev.filter((sentenceArr) => sentenceArr[6] !== cardId),
      );
    } catch (error) {
      console.log('## handleFlashCard Error: ', error);
    } finally {
      setLoadingResponse(false);
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
        sentenceToBeReplaced.targetLang;
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
          targetLang: sentence.replace(japaneseRegex, ''),
          eng: lines[i + 1].replace(engRegex, ''),
        };
        sentences.push(sentenceObj);
      }
    }

    return sentences;
  };

  const deleteSentenceLogic = (sentenceToRemoveId) => {
    return response.map((resItem) => {
      const newResponse = resItem.response.filter(
        (nestedRes) => nestedRes.id !== sentenceToRemoveId,
      );
      return {
        wordBank: resItem.wordBank,
        response: newResponse,
      };
    });
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

  const handleChatGPTRes = async (
    prompt,
    model = 'gpt-3.5-turbo',
    withAudio,
  ) => {
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
      if (withAudio) {
        await Promise.all(
          structuredJapEngRes.map(
            async (sentenceData) => await getCorrespondingAudio(sentenceData),
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const getCorrespondingAudio = async (japaneseSentenceData) => {
    if (!japaneseSentenceData) return null;
    try {
      const responseFiles = await fetch('/api/chatgpt-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: japaneseSentenceData.id,
          tts: japaneseSentenceData.targetLang,
        }),
      });
      const availableMP3Files = JSON.parse(await responseFiles.text());
      setMp3Bank(availableMP3Files);
    } catch (error) {
      console.error('## Error fetching data (audio):', error);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <LearningBase
        sentenceList={sentenceListState}
        handleAddToWordBank={handleAddToWordBank}
        wordBankForGeneratedWords={wordBankForGeneratedWords}
        deleteWordFromSentenceList={deleteWordFromSentenceList}
        wordBank={wordBank}
        handleFlashCard={handleFlashCard}
      />
      <WordBankSection
        wordBankRef={wordBankRef}
        wordBank={wordBank}
        handleRemoveFromBank={handleRemoveFromBank}
      />
      {isLoadingResponse && <LoadingStatus />}
      {wordBank?.length > 0 && (
        <GetContentActions
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
          mp3Bank={mp3Bank}
        />
      ) : null}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const satoriData = await satoriReviewhandler();
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
          firstContext.cardId,
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
