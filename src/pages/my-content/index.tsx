import { v4 as uuidv4 } from 'uuid';
import LoadingStatus from '@/components/LoadingStatus';
import MyContentTextArea from '@/components/MyContentTextArea';
import { getThoughtsToBilingualText } from '@/prompts/utils';
import { useState } from 'react';
import MyContentSection from '@/components/MyContentSection';
import PersonalWordBankStudySection from '@/components/PersonalWordBankStudySection';
import { useRouter } from 'next/router';
import chatGptAPI from '../api/chatgpt';
import Header from './Header';
import getNarakeetAudio from '../api/narakeet';
import getChatGptTTS from '../api/tts-audio';
import saveContentAPI from '../api/save-content';
import { loadInContent } from '../api/load-content';
import LoadContentControls from './LoadContentControls';
import { makeArrayUnique } from '@/utils/makeArrayUnique';
import WordBankSection from '@/components/WordBankSection';
import useWordBank from '@/hooks/useWordBank';
import GetContentActions from '@/components/GetContentActions';
import ContentActions from './ContentActions';
import underlineTargetWords from '../api/underline-target-words';
import ResponseSection from '@/components/ResponseSection';
import addJapaneseSentenceAPI from '../api/add-japanese-sentence';
import JapaneseWordItem from './JapaneseWordItem';
import SatoriStyleReader from '@/components/SatoriStyleReader';

const japaneseContent = 'japaneseContent';
const japaneseWords = 'japaneseWords';
const japaneseSentences = 'japaneseSentences';

const ContentCreationSection = ({
  setInputValue,
  setThemeValue,
  translatedText,
  handleMyTextTranslated,
  saveContentToFirebase,
  themeValue,
  inputValue,
  parts,
}) => {
  return (
    <>
      <MyContentTextArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        themeValue={themeValue}
        setThemeValue={setThemeValue}
        translatedText={translatedText}
      />
      <ContentActions
        handleMyTextTranslated={handleMyTextTranslated}
        saveContentToFirebase={saveContentToFirebase}
        themeValue={themeValue}
      />
      {inputValue && (
        <ul>
          {parts.map((part, index) => (
            <li key={index}>{part.trim()}</li>
          ))}
        </ul>
      )}
    </>
  );
};

const HeaderCTAs = ({
  setShowTextArea,
  showTextArea,
  handleLoadWords,
  handleLoadWordsViaTopic,
  handleLoadWordsSelectedTopicsWords,
}) => {
  return (
    <div>
      <button
        onClick={() => setShowTextArea(!showTextArea)}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Content text
      </button>
      <button
        onClick={handleLoadWords}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '5px',
        }}
      >
        Load Words
      </button>
      <button
        onClick={handleLoadWordsViaTopic}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '5px',
        }}
      >
        Load Words via topics
      </button>
      <button
        onClick={handleLoadWordsSelectedTopicsWords}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '5px',
        }}
      >
        Load selected topics words
      </button>
    </div>
  );
};

export default function MyContentPage(props) {
  const japaneseLoadedContent = props?.japaneseLoadedContent;
  const japaneseLoadedWords = props?.japaneseLoadedWords;
  const japaneseLoadedSentences = props?.japaneseLoadedSentences;
  const wordsByTopics = props?.wordsByTopics;

  let pureWords = [];
  japaneseLoadedWords?.forEach((wordData) => {
    pureWords.push(wordData.baseForm);
    pureWords.push(wordData.surfaceForm);
  });

  const pureWordsUnique =
    pureWords?.length > 0 ? makeArrayUnique(pureWords) : [];

  const topics =
    japaneseLoadedContent && Object.keys(japaneseLoadedContent).length > 0
      ? Object.keys(japaneseLoadedContent)
      : [];

  const [isLoadingResponse, setLoadingResponse] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');

  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedWithAudio, setWithAudio] = useState('');

  const [response, setResponse] = useState([]);
  const [mp3Bank, setMp3Bank] = useState([]);

  const [showTextArea, setShowTextArea] = useState(false);
  const [showLoadedWords, setShowLoadedWords] = useState(false);

  const [showLoadedWordsViaTopics, setShowLoadedWordsViaTopics] =
    useState(false);
  const [loadedTopicData, setLoadedTopicData] = useState({
    topic: '',
    content: [],
  });
  const [translatedText, setTranslatedText] = useState([]);

  const selectedTopic = loadedTopicData?.topic;

  const selectedTopicIndex = topics?.findIndex(
    (topic) => topic === selectedTopic,
  );

  const selectedTopicWords = selectedTopic
    ? wordsByTopics[selectedTopicIndex]
    : null;

  const router = useRouter();
  const {
    handleAddToWordBank,
    handleRemoveFromBank,
    handleClearWordBank,
    wordBank,
  } = useWordBank();

  const handlePromptChange = (event) => {
    setSelectedPrompt(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleNavigateToMyContent = () => {
    router.push('/');
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
      return false;
    }
  };

  const handleMyTextTranslated = async (withNara) => {
    try {
      setLoadingResponse(true);
      const fullPrompt = getThoughtsToBilingualText(inputValue, themeValue);
      const res = await chatGptAPI({
        sentence: fullPrompt,
        model: 'gpt-4',
      });
      const responseWithIdAndAudio = await Promise.all(
        res.map(async (item) => {
          const id = uuidv4();
          return {
            id: id,
            ...item,
            hasAudio: await getCorrespondingAudio({ ...item, id }, withNara),
          };
        }),
      );

      setTranslatedText(responseWithIdAndAudio);
      setInputValue('');
    } catch (error) {
      console.log('## handleMyTextTranslated error: ', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleTopicLoad = (topic) => {
    setLoadedTopicData({ topic, content: japaneseLoadedContent[topic] });
  };

  const handleLoadWords = () => {
    setShowLoadedWords(!showLoadedWords);
  };

  const handleLoadWordsViaTopic = () => {
    setShowLoadedWordsViaTopics(!showLoadedWordsViaTopics);
  };
  const handleWithAudioChange = (event) => {
    setWithAudio(event.target.value);
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

  const handleLoadWordsSelectedTopicsWords = () => {};

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

  const saveContentToFirebaseSatori = async ({ contentObject }) => {
    const id = contentObject.id;
    const hasAudio = mp3Bank.some((sentenceId) => sentenceId === id);

    const finalEntryObject = {
      ...contentObject,
      hasAudio,
    };

    try {
      setLoadingResponse(true);
      await addJapaneseSentenceAPI({
        contentEntry: finalEntryObject,
      });
      // add to state to show its added
    } catch (error) {
      //
    } finally {
      setLoadingResponse(false);
    }
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

  const saveContentToFirebase = async () => {
    const contentEntry = {
      [themeValue.toLowerCase()]: translatedText,
    };

    try {
      setLoadingResponse(true);
      await saveContentAPI({
        ref: japaneseContent,
        contentEntry,
      });
    } catch (error) {
      console.log('## saveContentToFirebase error: ', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const getWordsContext = (contextId) => {
    for (const key in japaneseLoadedContent) {
      if (japaneseLoadedContent.hasOwnProperty(key)) {
        const objectsArray = japaneseLoadedContent[key];
        // Search for the object with the matching 'id' property
        const matchingObject = objectsArray.find((obj) => obj.id === contextId);
        // If the object is found, return it
        if (matchingObject) {
          return matchingObject.targetLang;
        }
      }
    }
    // If no matching object is found, return null or handle the case accordingly
    return '';
  };
  const parts = inputValue?.split('\n');

  if (
    !(
      japaneseLoadedContent.length > 0 ||
      japaneseLoadedWords.length > 0 ||
      japaneseLoadedSentences.length > 0 ||
      wordsByTopics.length > 0
    )
  ) {
    return <div>Siuu</div>;
  }

  return (
    <div
      style={{
        padding: '15px',
      }}
    >
      <Header handleNavigateToMyContent={handleNavigateToMyContent} />
      {isLoadingResponse && <LoadingStatus />}
      <HeaderCTAs
        setShowTextArea={setShowTextArea}
        showTextArea={showTextArea}
        handleLoadWords={handleLoadWords}
        handleLoadWordsViaTopic={handleLoadWordsViaTopic}
        handleLoadWordsSelectedTopicsWords={handleLoadWordsSelectedTopicsWords}
      />
      {topics?.length ? (
        <LoadContentControls
          topics={topics}
          handleTopicLoad={handleTopicLoad}
        />
      ) : null}
      {showTextArea ? (
        <ContentCreationSection
          setInputValue={setInputValue}
          setThemeValue={setThemeValue}
          translatedText={translatedText}
          handleMyTextTranslated={handleMyTextTranslated}
          saveContentToFirebase={saveContentToFirebase}
          themeValue={themeValue}
          inputValue={inputValue}
          parts={parts}
        />
      ) : null}
      {inputValue && (
        <ul>
          {parts.map((part, index) => (
            <li key={index}>{part.trim()}</li>
          ))}
        </ul>
      )}
      {translatedText?.length > 0 && (
        <MyContentSection translatedText={translatedText} />
      )}
      {loadedTopicData.content?.length > 0 ? (
        <SatoriStyleReader
          content={loadedTopicData.content}
          topic={loadedTopicData.topic}
          pureWordsUnique={pureWordsUnique}
          selectedTopicWords={selectedTopicWords}
          handleAddToWordBank={handleAddToWordBank}
          getWordsContext={getWordsContext}
        />
      ) : null}
      <PersonalWordBankStudySection />
      {showLoadedWords ? (
        <div>
          <p>Word list</p>
          <button onClick={handleClearWordBank}>Clear bank</button>
          <ul>
            {japaneseLoadedWords.map((japaneseWord) => (
              <JapaneseWordItem
                key={japaneseWord.id}
                japaneseWord={japaneseWord}
                handleAddToWordBank={handleAddToWordBank}
                getWordsContext={getWordsContext}
              />
            ))}
          </ul>
        </div>
      ) : null}

      {wordBank?.length > 0 ? (
        <WordBankSection
          wordBank={wordBank}
          handleRemoveFromBank={handleRemoveFromBank}
        />
      ) : null}

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
          handleDeleteSentence={() => {}}
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
    const japaneseLoadedContent = await loadInContent({
      ref: japaneseContent,
    });
    const japaneseLoadedWords =
      (await loadInContent({
        ref: japaneseWords,
      })) || [];
    const japaneseLoadedSentences =
      (await loadInContent({
        ref: japaneseSentences,
      })) || [];

    const topics =
      japaneseLoadedContent && Object.keys(japaneseLoadedContent).length > 0
        ? Object.keys(japaneseLoadedContent)
        : [];

    const getAdditionalContexts = (wordFormsArr) => {
      const [baseWord, surfaceWord] = wordFormsArr;

      return japaneseLoadedSentences.filter((sentence) => {
        if (sentence.matchedWords.includes(baseWord)) {
          return true;
        }
        if (sentence.matchedWords.includes(surfaceWord)) {
          return true;
        }
        return false;
      });
    };

    const wordsByTopics = topics.map((topic) => {
      const allIdsFromTopicSentences = japaneseLoadedContent[topic].map(
        (item) => item.id,
      );
      const filteredWordsThatHaveMatchingContext = japaneseLoadedWords.filter(
        (japaneseWord) =>
          japaneseWord.contexts.some((context) =>
            allIdsFromTopicSentences.includes(context),
          ),
      );
      const wordsWithAdditionalContextAdded =
        filteredWordsThatHaveMatchingContext.map((japaneseWord) => {
          const contexts = japaneseWord.contexts;
          const originalContext = japaneseLoadedContent[topic].find(
            (contentWidget) => contentWidget.id === contexts[0],
          );

          return {
            ...japaneseWord,
            contexts: [
              originalContext,
              ...getAdditionalContexts([
                japaneseWord.baseForm,
                japaneseWord.surfaceForm,
              ]),
            ],
          };
        });

      return wordsWithAdditionalContextAdded;
    });

    return {
      props: {
        japaneseLoadedContent,
        japaneseLoadedWords,
        japaneseLoadedSentences,
        wordsByTopics,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        satoriData: [],
        contextHelperData: [],
        wordsByTopics: [],
        japaneseLoadedSentences: [],
      },
    };
  }
}
