import { v4 as uuidv4 } from 'uuid';
import LoadingStatus from '@/components/LoadingStatus';
import { getThoughtsToBilingualText } from '@/prompts/utils';
import { useState } from 'react';
import { useRouter } from 'next/router';
import chatGptAPI from '../api/chatgpt';
import Header from './Header';
import getNarakeetAudio from '../api/narakeet';
import getChatGptTTS from '../api/tts-audio';
import saveContentAPI from '../api/save-content';
import { loadInMultipleContent } from '../api/load-content';
import LoadContentControls from './LoadContentControls';
import { makeArrayUnique } from '@/utils/makeArrayUnique';
import WordBankSection from '@/components/WordBankSection';
import useWordBank from '@/hooks/useWordBank';
import GetContentActions from '@/components/GetContentActions';
import underlineTargetWords from '../api/underline-target-words';
import ResponseSection from '@/components/ResponseSection';
import addJapaneseSentenceAPI from '../api/add-japanese-sentence';
import JapaneseWordItem from './JapaneseWordItem';
import SatoriStyleReader from '@/components/SatoriStyleReader';
import ContentCreationSection from './ContentCreationSection';
import HeaderCTAs from './HeaderCTAs';
import updateContentSentence from '../api/update-content-sentence';
import { content, sentences, words } from '@/refs';

export default function MyContentPage(props) {
  const [japaneseLoadedContent, setJapaneseLoadedContent] = useState(
    props?.japaneseLoadedContent,
  );
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

  const [isLoadingResponse, setLoadingResponse] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');
  const [contextInputValue, setContextInputValue] = useState('');

  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedWithAudio, setWithAudio] = useState('');

  const [response, setResponse] = useState([]);
  const [mp3Bank, setMp3Bank] = useState([]);

  const [showTextArea, setShowTextArea] = useState(false);
  const [showLoadedWords, setShowLoadedWords] = useState(false);
  const [isBilingualContentMode, setIsBilingualContentMode] = useState(false);

  const [loadedTopicData, setLoadedTopicData] = useState(null);
  const [translatedText, setTranslatedText] = useState([]);

  const selectedTopic = loadedTopicData?.title;
  const topics = japaneseLoadedContent.map((topicData) => topicData.title);

  const selectedTopicIndex = japaneseLoadedContent?.findIndex(
    (topicData) => topicData.title === selectedTopic,
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

  const handleNavigateTo = (param) => {
    router.push(param);
  };

  const handleUpdateContentSentence = async ({
    sentenceId,
    topicName,
    fieldToUpdate,
    withAudio,
  }) => {
    try {
      const updateContentSentenceRes = await updateContentSentence({
        ref: content,
        sentenceId,
        topicName,
        fieldToUpdate,
        withAudio,
      });
      if (updateContentSentenceRes) {
        const updatedContent = japaneseLoadedContent.map((contentData) => {
          if (contentData.title !== topicName) {
            return contentData;
          }

          const content = contentData.content.map((sentenceData) => {
            if (sentenceData.id !== sentenceId) {
              return sentenceData;
            }

            console.log('## updating sentence ', sentenceData.baseLang);
            return {
              ...sentenceData,
              ...fieldToUpdate,
            };
          });

          return {
            ...contentData,
            content,
          };
        });
        setJapaneseLoadedContent(updatedContent);
      }
    } catch (error) {
      console.error('## handleUpdateContentSentence ', error);
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
      return false;
    }
  };

  const isOddNumber = (number) => number % 2 !== 0;

  const handleMyTextTranslated = async ({ withNara, prompt, pureJSON }) => {
    try {
      setLoadingResponse(true);

      const formatMyBilingualText = [];
      const splitUpText = pureJSON && inputValue?.trim().split('\n');
      if (pureJSON) {
        splitUpText.forEach((part, index) => {
          const isTarget = !isOddNumber(index);
          if (isTarget) {
            formatMyBilingualText.push({
              targetLang: part,
              baseLang: splitUpText[index + 1],
            });
          }
        });
      }

      const fullPrompt = getThoughtsToBilingualText({
        inputValue,
        themeValue,
        prompt,
        bilingualJson: pureJSON ? formatMyBilingualText : null,
        contextInputValue,
      });

      const res = await chatGptAPI({
        sentence: fullPrompt,
        model: 'gpt-4',
      });
      const responseWithIdAndAudio = await Promise.all(
        res.map(async (item) => {
          const id = uuidv4();
          return {
            id,
            ...item,
            hasAudio: await getCorrespondingAudio({ ...item, id }, withNara),
          };
        }),
      );

      setTranslatedText(responseWithIdAndAudio);
    } catch (error) {
      console.log('## handleMyTextTranslated error: ', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleTopicLoad = (topic) => {
    setLoadedTopicData(
      japaneseLoadedContent.find((topicData) => topicData.title === topic),
    );
  };

  const handleLoadWords = () => {
    setShowLoadedWords(!showLoadedWords);
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
      title: themeValue.toLowerCase(),
      content: translatedText,
    };
    try {
      setLoadingResponse(true);
      await saveContentAPI({
        ref: content,
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
      <Header handleNavigateTo={handleNavigateTo} />
      {isLoadingResponse && <LoadingStatus />}
      <HeaderCTAs
        setShowTextArea={setShowTextArea}
        showTextArea={showTextArea}
        handleLoadWords={handleLoadWords}
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
          handleMyTextTranslated={handleMyTextTranslated}
          saveContentToFirebase={saveContentToFirebase}
          themeValue={themeValue}
          inputValue={inputValue}
          setIsBilingualContentMode={setIsBilingualContentMode}
          isBilingualContentMode={isBilingualContentMode}
          setContextInputValue={setContextInputValue}
          contextInputValue={contextInputValue}
        />
      ) : null}
      {loadedTopicData ? (
        <SatoriStyleReader
          pureWordsUnique={pureWordsUnique}
          selectedTopicWords={selectedTopicWords}
          handleAddToWordBank={handleAddToWordBank}
          getWordsContext={getWordsContext}
          handleUpdateContentSentence={handleUpdateContentSentence}
          loadedTopicData={loadedTopicData}
        />
      ) : null}
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
    const contentSentencesWords = await loadInMultipleContent({
      refs: [content, words, sentences],
    });

    const getNestedObjectData = (thisRef) => {
      return contentSentencesWords.find((el) => {
        const dataKeys = Object.keys(el);
        if (dataKeys.includes(thisRef)) {
          return el;
        }
      });
    };

    const japaneseLoadedContent = getNestedObjectData(content).content;
    const japaneseLoadedSentences = getNestedObjectData(sentences).sentences;
    const japaneseLoadedWords = getNestedObjectData(words).words;

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

    const wordsByTopics = japaneseLoadedContent.map((topic) => {
      const allIdsFromTopicSentences = topic.content.map((item) => item?.id);
      const filteredWordsThatHaveMatchingContext = japaneseLoadedWords.filter(
        (japaneseWord) =>
          japaneseWord.contexts.some((context) =>
            allIdsFromTopicSentences.includes(context),
          ),
      );
      const wordsWithAdditionalContextAdded =
        filteredWordsThatHaveMatchingContext.map((japaneseWord) => {
          const contexts = japaneseWord.contexts;
          const originalContext = topic.content.find(
            (contentWidget) => contentWidget?.id === contexts[0],
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
        japaneseLoadedContent: japaneseLoadedContent,
        japaneseLoadedWords: japaneseLoadedWords,
        japaneseLoadedSentences: japaneseLoadedSentences,
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
