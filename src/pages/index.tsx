import satoriCardsBulkAPI from '../api/satori-cards-bulk';
import LearningBase from '@/components/LearningBase';
import { useEffect, useState } from 'react';
import ResponseSection from '@/components/ResponseSection';
import WordBankSection from '@/components/WordBankSection';
import GetContentActions from '@/components/GetContentCTAs';
import LoadingStatus from '@/components/LoadingStatus';
import { v4 as uuidv4 } from 'uuid';
import {
  combinePrompt,
  moodIntensivePrompt,
  nonIndicativeIntensivePrompt,
  storyPrompt,
} from '@/prompts';
import '../app/styles/globals.css';
import FlashCardDoneToast from '@/components/FlashCardDoneToast';
import chatGptAPI from './api/chatgpt';
import getSatoriAudio from '@/api/audio';
import getChatGptTTS from './api/tts-audio';
import getNarakeetAudio from './api/narakeet';
import handleSatoriFlashcardAPI from './api/satori-flashcard';
import underlineTargetWords from './api/underline-target-words';

const RadioButtonExample = () => {
  const [selectedOption, setSelectedPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedWithAudio, setWithAudio] = useState('');

  const handlePromptChange = (event) => {
    setSelectedPrompt(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };
  const handleWithAudioChange = (event) => {
    setWithAudio(event.target.value);
  };

  const promptOptions = [
    {
      label: 'Get story',
      option: storyPrompt,
    },
    {
      label: 'Combine words',
      option: combinePrompt,
    },
    {
      label: 'Mixed moods combine',
      option: moodIntensivePrompt,
    },
    {
      label: 'Non Indicative mood',
      option: nonIndicativeIntensivePrompt,
    },
  ];
  const chatgptModels = [
    {
      label: 'gpt-4',
      option: 'gpt-4',
    },
    {
      label: 'gpt-3.5-turbo',
      option: 'gpt-3.5-turbo',
    },
  ];

  const audioOptions = [
    {
      label: 'With Audio (ChatGPT)',
      option: 'chatgpt',
    },
    {
      label: 'No Audio',
      option: 'No Audio',
    },
    {
      label: 'With Audio (Narakeet)',
      option: 'Narakeet',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <p>Choose a prompt:</p>
          {promptOptions.map((option, index) => {
            return (
              <label key={index}>
                <input
                  type='radio'
                  value={option.option}
                  checked={selectedOption === option.option}
                  onChange={handlePromptChange}
                />
                {option.label}
                <br />
              </label>
            );
          })}
        </div>
        <div>
          <p>Choose a model:</p>
          {chatgptModels.map((option, index) => {
            return (
              <label key={index}>
                <input
                  type='radio'
                  value={option.option}
                  checked={selectedModel === option.option}
                  onChange={handleModelChange}
                />
                {option.label}
                <br />
              </label>
            );
          })}
        </div>
        <div>
          <p>Choose a audio:</p>
          {audioOptions.map((option, index) => {
            return (
              <label key={index}>
                <input
                  type='radio'
                  value={option.option}
                  checked={selectedWithAudio === option.option}
                  onChange={handleWithAudioChange}
                />
                {option.label}
                <br />
              </label>
            );
          })}
        </div>
      </div>

      <p>Selected Prompt: {selectedOption}</p>
      <p>Selected Model: {selectedModel}</p>
      {selectedWithAudio && <p>With Audio: {selectedModel}</p>}
    </div>
  );
};

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
  const [isHandleAllSentence, setHandleAllSentence] = useState(false);
  const [mp3Bank, setMp3Bank] = useState([]);

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
        eng: item.baseLang,
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

  useEffect(() => {
    const callHandler = async () => {
      await handleChatGPTRes({
        prompt: combinePrompt,
        model: 'gpt-4',
        audio: true,
      });
    };
    if (isHandleAllSentence && sentenceListState?.length > 0) {
      callHandler();
      setHandleAllSentence(false);
    }
  }, [isHandleAllSentence, sentenceListState]);

  const handleAllSentences = () => {
    sentenceList.forEach((sentenceSnippet) => {
      handleAddToWordBank({
        word: sentenceSnippet.textWithKanji,
        context: sentenceSnippet.fullSentence,
        definition: sentenceSnippet.definition,
      });
    });
    setHandleAllSentence(true);
  };

  const handleChatGPTRes = async ({
    prompt,
    model = 'gpt-3.5-turbo',
    audio,
  }) => {
    try {
      setLoadingResponse(true);
      let finalPrompt = prompt;
      let wordBankToText = '';

      wordBank.forEach((wordBankData) => {
        const fullText = `${wordBankData.word} context: ${wordBankData.context}\n`;
        wordBankToText = wordBankToText + fullText;
      });

      finalPrompt = finalPrompt + '\n' + wordBankToText;

      if (!finalPrompt) return;
      const res = await chatGptAPI({ sentence: finalPrompt, model });
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
      if (audio) {
        await Promise.all(
          structuredJapEngRes.map(
            async (sentenceData) =>
              await getCorrespondingAudio(sentenceData, audio),
          ),
        );
      }
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const getCorrespondingAudio = async (japaneseSentenceData, audio) => {
    if (!japaneseSentenceData) return null;
    try {
      const apiEndPoint =
        audio === 'narakeet' ? '/api/narakeet' : '/api/chatgpt-tts';

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
      <WordBankSection
        wordBank={wordBank}
        handleRemoveFromBank={handleRemoveFromBank}
      />
      {isLoadingResponse && <LoadingStatus />}
      <RadioButtonExample />
      {wordBank?.length > 0 && (
        <GetContentActions
          handleChatGPTRes={handleChatGPTRes}
          isLoadingResponse={isLoadingResponse}
          handleClearWordBank={handleClearWordBank}
          handleAllSentences={handleAllSentences}
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
