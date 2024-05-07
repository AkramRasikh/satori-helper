import satoriCardsBulkAPI from '../api/satori-cards-bulk';
import LearningBase from '@/components/LearningBase';
import { useState } from 'react';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';
import LoadingStatus from '@/components/LoadingStatus';
import { v4 as uuidv4 } from 'uuid';
import '../app/styles/globals.css';
import FlashCardDoneToast from '@/components/FlashCardDoneToast';
import chatGptAPI from './api/chatgpt';
import getSatoriAudio from '@/api/audio';
import getChatGptTTS from './api/tts-audio';
import getNarakeetAudio from './api/narakeet';
import handleSatoriFlashcardAPI from './api/satori-flashcard';
import underlineTargetWords from './api/underline-target-words';
import GetContentActions from '@/components/GetContentActions';
import SelectAllButtons from '@/components/SelectAllButtons';
import TextInput from '@/components/TextInput';
import { getThoughtsToBilingualText } from '@/prompts/utils';
import { contentResponseMock } from '@/mocks/content-response';
import MyContentSection from '@/components/MyContentSection';

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
  const [translatedText, setTranslatedText] = useState(contentResponseMock);

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
    const underlinedSentence = sentence.replace(
      pattern,
      (match) => `<u>${match}</u>`,
    );

    return underlinedSentence;
  };

  const addIdToResponse = async (parsedResponse, thisWordBank) => {
    const responseWithId = await Promise.all(
      parsedResponse.map(async (item) => ({
        id: uuidv4(),
        targetLang: item.targetLang,
        baseLang: item.baseLang,
        moodUsed: item?.moodUsed,
        underlinedText: await underlineWordsInSentence(
          item.targetLang,
          thisWordBank,
        ),
      })),
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
        await Promise.all(
          structuredJapEngRes.map(
            async (sentenceData) =>
              await getCorrespondingAudio(sentenceData, selectedWithAudio),
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const saveToJSON = async () => {
    console.log('## translatedText: ', translatedText);
    const divider = {
      isDivider: true,
    };
    const contentWithDivider = [...translatedText, divider];
    console.log('## contentWithDivider: ', contentWithDivider);

    await fetch('/api/save-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentWithDivider),
    })
      .then(async (response) => {
        const jsonED = await response.json();
        console.log('## jsonED: ', jsonED);

        return jsonED;
      })
      .then((data) =>
        console.log('## handleMyTextTranslated then data: ', data),
      )
      .catch((error) =>
        console.error('## handleMyTextTranslated Error:', error),
      );
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
      console.log('## res: ', res);

      setTranslatedText(res);
    } catch (error) {
      console.log('## handleMyTextTranslated, error');
    } finally {
      setLoadingResponse(false);
    }
  };

  const getCorrespondingAudio = async (japaneseSentenceData, audio) => {
    if (!japaneseSentenceData) return null;
    try {
      const responseFiles =
        audio === 'narakeet'
          ? await getNarakeetAudio({
              id: japaneseSentenceData.id,
              sentence: japaneseSentenceData.targetLang,
            })
          : await getChatGptTTS({
              id: japaneseSentenceData.id,
              sentence: japaneseSentenceData.targetLang,
            });
      setMp3Bank(responseFiles);
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
      <TextInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        themeValue={themeValue}
        setThemeValue={setThemeValue}
        translatedText={translatedText}
      />
      <button onClick={handleMyTextTranslated}>Lets go</button>
      {translatedText?.length > 0 && (
        <button onClick={saveToJSON}>Save content</button>
      )}
      {translatedText?.length > 0 && (
        <MyContentSection translatedText={translatedText} />
      )}
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
      {response?.length > 0 ? (
        <ResponseSection
          response={response}
          handleDeleteSentence={handleDeleteSentence}
          mp3Bank={mp3Bank}
        />
      ) : null}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const satoriData = await satoriCardsBulkAPI({ isDueAndAuto: true });
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

        const audioUrl = await getSatoriAudio({
          id: sentenceId,
          episode: articleCode,
        });

        return {
          fullSentence: allParts
            .map((item) => {
              if (item.text) {
                return item.text;
              }
              return item?.parts[0].text;
            })
            .join(''),
          textWithKanji: textWithKanji,
          textZeroKanji: textZeroKanji,
          audioUrl,
          definition: definition,
          engTranslation: engTranslation,
          cardId: firstContext.cardId,
        };
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
