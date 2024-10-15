import LearningBase from '@/components/LearningBase';
import { useState } from 'react';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';
import LoadingStatus from '@/components/LoadingStatus';
import { v4 as uuidv4 } from 'uuid';
import '../app/styles/globals.css';
import chatGptAPI from './api/chatgpt';
import getChatGptTTS from './api/tts-audio';
import getNarakeetAudio from './api/narakeet';
import handleSatoriFlashcardAPI from './api/satori-flashcard';
import underlineTargetWords from './api/underline-target-words';
import GetContentActions from '@/components/GetContentActions';
import saveContentAPI from './api/save-content';
import ContextHelpers from '@/components/ContextHelpers';
import { useRouter } from 'next/router';

export default function Home(props) {
  const sentenceList = props?.satoriData;
  const contextHelperData = props?.contextHelperData;
  const [wordBank, setWordBank] = useState([]);
  const [sentenceListState, setSentenceListState] = useState(sentenceList);
  const [wordBankForGeneratedWords, setWordBankForGeneratedWords] = useState(
    [],
  );
  const [response, setResponse] = useState([]);
  const [flashCardWordDone, setFlashCardWordDone] = useState('');
  const [isLoadingResponse, setLoadingResponse] = useState(false);
  const [mp3Bank, setMp3Bank] = useState([]);

  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedWithAudio, setWithAudio] = useState('');

  const router = useRouter();

  const numberOfWordsToStudy = sentenceList?.length;
  const numberOfWordsInWordBank = wordBank.length;

  const handlePromptChange = (event) => {
    setSelectedPrompt(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };
  const handleWithAudioChange = (event) => {
    setWithAudio(event.target.value);
  };

  const handleAddToWordBank = (wordData) => {
    const isWordInWord = wordBank.find(
      (wordObj) => wordObj.word === wordData.word,
    );
    if (!isWordInWord) {
      setWordBank((prev) => [...prev, wordData]);
    } else {
      setWordBank((prev) =>
        prev.filter((wordObj) => wordObj.word !== wordData.word),
      );
    }
  };

  const getNarakeetAudioFunc = async ({ id, sentence }) => {
    try {
      setLoadingResponse(true);
      await getNarakeetAudio({
        id,
        sentence,
      });
    } catch (error) {
      console.error('## getNarakeetAudioFunc: ', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const getFlashCardNumberToText = (flashCardNumber) => {
    if (flashCardNumber === 5) {
      return 'Easy 👍🏽';
    }

    if (flashCardNumber === 4) {
      return 'Medium 🤏🏾';
    }

    if (flashCardNumber === 3) {
      return 'Hard 👎';
    }
    return '';
  };

  const handleNavigateTo = (param) => {
    router.push(param);
  };

  const handleFlashCard = async (flashCardNumber, cardId) => {};

  const handleRemoveFromBank = (wordToDelete) => {
    const filteredWordBank = wordBank.filter(
      (wordData) => wordData.word !== wordToDelete,
    );

    setWordBank(filteredWordBank);
  };

  const underlineWordsInSentence = async (sentence, thisWordBank) => {
    const matchedWords = await underlineTargetWords({
      sentence,
      wordBank: thisWordBank,
    });

    const pattern = new RegExp(
      [...matchedWords, ...thisWordBank].join('|'),
      'g',
    );
    const underlinedText = sentence.replace(
      pattern,
      (match) => `<u>${match}</u>`,
    );

    return { underlinedText, matchedWords };
  };

  const addIdToResponse = async (parsedResponse, thisWordBank) => {
    const responseWithId = await Promise.all(
      parsedResponse.map(async (item) => {
        const { underlinedText, matchedWords } = await underlineWordsInSentence(
          item.targetLang,
          thisWordBank,
        );
        return {
          id: uuidv4(),
          targetLang: item.targetLang,
          baseLang: item.baseLang,
          moodUsed: item?.moodUsed,
          underlinedText,
          matchedWords,
        };
      }),
    );
    return responseWithId;
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
    const newSentenceList = sentenceListState.filter(
      (wordData) => wordData.textWithKanji !== word,
    );
    setSentenceListState(newSentenceList);
  };

  const handleClearWordBank = () => {
    setWordBank([]);
  };

  const handleAllSentences = () => {
    sentenceListState.forEach((sentenceSnippet) => {
      handleAddToWordBank({
        word: sentenceSnippet.textWithKanji,
        context: sentenceSnippet.fullSentence,
        definition: sentenceSnippet.definition,
      });
    });
  };

  const handleChatGPTRes = async () => {
    try {
      setLoadingResponse(true);
      let finalPrompt = selectedPrompt;
      let wordBankToText = '';

      wordBank.forEach((wordBankData) => {
        const fullText = `${wordBankData.word} context: ${wordBankData.context}\n`;
        wordBankToText = wordBankToText + fullText;
      });

      finalPrompt = finalPrompt + '\n' + wordBankToText;

      if (!finalPrompt) return;
      const res = await chatGptAPI({
        sentence: finalPrompt,
        model: selectedModel,
      });
      const thisWordBank = wordBank.map((word) => word.word);
      const structuredJapEngRes = await addIdToResponse(res, thisWordBank);

      setResponse((prev) => [
        ...prev,
        {
          wordBank: thisWordBank,
          response: structuredJapEngRes,
        },
      ]);
      setWordBankForGeneratedWords((prev) =>
        Array.from(
          new Set([...prev, ...wordBank.map((wordObj) => wordObj.word)]),
        ),
      );
      if (selectedWithAudio) {
        const res = await Promise.all(
          structuredJapEngRes.map(
            async (sentenceData) =>
              await getCorrespondingAudio(sentenceData, selectedWithAudio),
          ),
        );

        setMp3Bank((prev) => {
          if (prev?.length === 0) {
            return res;
          } else {
            return [...prev, ...res];
          }
        });
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const saveContentToFirebaseSatori = async ({ ref, contentObject }) => {
    const id = contentObject.id;
    const hasAudio = mp3Bank.some((sentenceId) => sentenceId === id);

    const finalEntryObject = {
      ...contentObject,
      hasAudio,
    };

    try {
      setLoadingResponse(true);
      await saveContentAPI({
        ref,
        contentEntry: finalEntryObject,
      });
      // add to state to show its added
    } catch (error) {
      //
    } finally {
      setLoadingResponse(false);
    }
  };

  const getCorrespondingAudio = async (japaneseSentenceData, audio) => {
    if (!japaneseSentenceData) return null;
    try {
      const successResIdOrSentence =
        audio === 'narakeet'
          ? await getNarakeetAudio({
              id: japaneseSentenceData.id,
              sentence: japaneseSentenceData.targetLang,
            })
          : await getChatGptTTS({
              id: japaneseSentenceData.id,
              sentence: japaneseSentenceData.targetLang,
            });
      return successResIdOrSentence;
    } catch (error) {
      console.error('## Error fetching data (audio):', error);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div
        style={{
          position: 'absolute',
          right: '10px',
        }}
      >
        <button
          style={{
            margin: 'auto 0',
            padding: '5px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          onClick={() => handleNavigateTo('/my-content')}
        >
          /my-content
        </button>
        <button
          style={{
            margin: 'auto 0',
            padding: '5px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => handleNavigateTo('/music')}
        >
          /music
        </button>
      </div>
      <LearningBase
        sentenceList={sentenceListState}
        handleAddToWordBank={handleAddToWordBank}
        wordBankForGeneratedWords={wordBankForGeneratedWords}
        deleteWordFromSentenceList={deleteWordFromSentenceList}
        wordBank={wordBank}
        handleFlashCard={handleFlashCard}
        numberOfWordsInWordBank={numberOfWordsInWordBank}
        numberOfWordsToStudy={numberOfWordsToStudy}
        handleAllSentences={handleAllSentences}
        handleClearWordBank={handleClearWordBank}
      />
      {isLoadingResponse && <LoadingStatus />}
      <WordBankSection
        wordBank={wordBank}
        handleRemoveFromBank={handleRemoveFromBank}
      />
      {wordBank?.length > 0 && (
        <GetContentActions
          selectedPrompt={selectedPrompt}
          handlePromptChange={handlePromptChange}
          selectedModel={selectedModel}
          handleModelChange={handleModelChange}
          selectedWithAudio={selectedWithAudio}
          handleWithAudioChange={handleWithAudioChange}
          handleChatGPTRes={handleChatGPTRes}
          isLoadingResponse={isLoadingResponse}
        />
      )}
      {contextHelperData?.length ? (
        <ContextHelpers contextHelperData={contextHelperData} />
      ) : null}
      {response?.length > 0 ? (
        <ResponseSection
          response={response}
          handleDeleteSentence={handleDeleteSentence}
          mp3Bank={mp3Bank}
          saveContentToFirebaseSatori={saveContentToFirebaseSatori}
          getNarakeetAudioFunc={getNarakeetAudioFunc}
        />
      ) : null}
    </div>
  );
}

export async function getStaticProps() {
  try {
    return {
      props: {
        satoriData: [],
        contextHelperData: [],
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        satoriData: [],
        contextHelperData: [],
      },
    };
  }
}
