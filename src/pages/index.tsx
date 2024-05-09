import satoriCardsBulkAPI from './api/satori-cards-bulk';
import LearningBase from '@/components/LearningBase';
import { useState } from 'react';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';
import LoadingStatus from '@/components/LoadingStatus';
import { v4 as uuidv4 } from 'uuid';
import '../app/styles/globals.css';
import FlashCardDoneToast from '@/components/FlashCardDoneToast';
import chatGptAPI from './api/chatgpt';
import getChatGptTTS from './api/tts-audio';
import getNarakeetAudio from './api/narakeet';
import handleSatoriFlashcardAPI from './api/satori-flashcard';
import underlineTargetWords from './api/underline-target-words';
import GetContentActions from '@/components/GetContentActions';
import SelectAllButtons from '@/components/SelectAllButtons';
import TextInput from '@/components/TextInput';
import { getThoughtsToBilingualText } from '@/prompts/utils';
import MyContentSection from '@/components/MyContentSection';
import PersonalWordBankStudySection from '@/components/PersonalWordBankStudySection';
import saveContentAPI from './api/save-content';
import saveWordAPI from './api/save-word';

export default function Home(props) {
  const sentenceList = props?.satoriData;
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
  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');
  const [translatedText, setTranslatedText] = useState([]);

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

  const handleFlashCard = async (flashCardNumber, cardId) => {
    const wordToBeRemoved = sentenceListState.find(
      (el) => el.cardId === cardId,
    );
    try {
      setLoadingResponse(true);
      const flashcardResponse = await handleSatoriFlashcardAPI({
        flashCardDifficulty: flashCardNumber,
        cardId,
      });
      const flashcardResponseCardId = flashcardResponse.cardId;
      if (flashcardResponseCardId === cardId) {
        setSentenceListState((prev) =>
          prev.filter((sentenceArr) => sentenceArr.cardId !== cardId),
        );
        setFlashCardWordDone(
          `${wordToBeRemoved.textWithKanji} updated ✅ ` +
            getFlashCardNumberToText(flashCardNumber),
        );
      }
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
    sentenceList.forEach((sentenceSnippet) => {
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
      const res = await saveContentAPI({
        ref,
        contentEntry: finalEntryObject,
      });
      console.log('## Saved!: ', res);
    } catch (error) {
      //
    } finally {
      setLoadingResponse(false);
    }
  };

  const saveWordToFirebase = async () => {
    try {
      setLoadingResponse(true);
      const res = await saveWordAPI({
        ref: 'japanese',
        contentEntry: {
          'general-ting-01': translatedText,
        },
      });
      console.log('## Saved!: ', res);
    } catch (error) {
      //
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleMyTextTranslated = async () => {
    try {
      setLoadingResponse(true);
      const fullPrompt = getThoughtsToBilingualText(inputValue, themeValue);
      console.log('## fullPrompt: ', fullPrompt);
      const res = await chatGptAPI({
        sentence: fullPrompt,
        model: 'gpt-4',
      });
      const responseWithId = res.map((item) => ({ id: uuidv4(), ...item }));

      setTranslatedText(responseWithId);
    } catch (error) {
      console.log('## handleMyTextTranslated, error');
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
      {flashCardWordDone && (
        <FlashCardDoneToast
          text={flashCardWordDone}
          setFlashCardWordDone={setFlashCardWordDone}
        />
      )}
      <LearningBase
        sentenceList={sentenceListState}
        handleAddToWordBank={handleAddToWordBank}
        wordBankForGeneratedWords={wordBankForGeneratedWords}
        deleteWordFromSentenceList={deleteWordFromSentenceList}
        wordBank={wordBank}
        handleFlashCard={handleFlashCard}
      />
      {/* <TextInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        themeValue={themeValue}
        setThemeValue={setThemeValue}
        translatedText={translatedText}
      />

      <button onClick={handleMyTextTranslated}>Lets go</button>
      {translatedText?.length > 0 && (
        <button onClick={saveContentToFirebase}>Save content</button>
      )}
      {translatedText?.length > 0 && (
        <MyContentSection translatedText={translatedText} />
      )} */}
      {isLoadingResponse && <LoadingStatus />}
      <SelectAllButtons
        numberOfWordsInWordBank={numberOfWordsInWordBank}
        numberOfWordsToStudy={numberOfWordsToStudy}
        handleAllSentences={handleAllSentences}
        handleClearWordBank={handleClearWordBank}
      />
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
      {/* <PersonalWordBankStudySection /> */}
      {response?.length > 0 ? (
        <ResponseSection
          response={response}
          handleDeleteSentence={handleDeleteSentence}
          mp3Bank={mp3Bank}
          saveContentToFirebaseSatori={saveContentToFirebaseSatori}
        />
      ) : null}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const satoriData = await satoriCardsBulkAPI();

    return {
      props: {
        satoriData: satoriData,
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
