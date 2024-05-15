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

const japaneseContent = 'japaneseContent';
const japaneseWords = 'japaneseWords';

const ContentActions = ({
  handleMyTextTranslated,
  saveContentToFirebase,
  themeValue,
}) => {
  return (
    <div
      style={{
        width: '80%',
        margin: 'auto',
      }}
    >
      <button
        onClick={handleMyTextTranslated}
        style={{
          marginTop: '10px',
          padding: '5px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Translate content
      </button>
      <button
        onClick={() => handleMyTextTranslated('narakeet')}
        style={{
          marginTop: '10px',
          marginLeft: '10px',
          padding: '5px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Translate content + Nara
      </button>
      <div
        style={{
          borderRight: '1px solid black',
          height: '100%',
          display: 'inline',
          marginLeft: '10px',
        }}
      />
      <button
        onClick={saveContentToFirebase}
        style={{
          marginTop: '10px',
          marginLeft: '10px',
          padding: '5px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Save to Firebase {themeValue}
      </button>
    </div>
  );
};

export default function MyContentPage(props) {
  const japaneseLoadedContent = props?.japaneseLoadedContent;
  const japaneseLoadedWords = props?.japaneseLoadedWords;
  let pureWords = [];
  japaneseLoadedWords?.forEach((wordData) => {
    pureWords.push(wordData.baseForm);
    pureWords.push(wordData.surfaceForm);
  });

  const pureWordsUnique = makeArrayUnique(pureWords);

  const topics =
    japaneseLoadedContent && Object.keys(japaneseLoadedContent).length > 0
      ? Object.keys(japaneseLoadedContent)
      : [];

  const [isLoadingResponse, setLoadingResponse] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);
  const [showLoadedWords, setShowLoadedWords] = useState(false);
  const [loadedTopicData, setLoadedTopicData] = useState([]);
  const [translatedText, setTranslatedText] = useState([]);
  const router = useRouter();

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
    setLoadedTopicData(japaneseLoadedContent[topic]);
  };

  const handleLoadWords = () => {
    setShowLoadedWords(!showLoadedWords);
  };

  const handleAddToWordBank = () => {};

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
  const parts = inputValue?.split('\n');

  return (
    <div
      style={{
        padding: '15px',
      }}
    >
      <Header handleNavigateToMyContent={handleNavigateToMyContent} />
      {isLoadingResponse && <LoadingStatus />}
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
      </div>
      {topics?.length ? (
        <LoadContentControls
          topics={topics}
          handleTopicLoad={handleTopicLoad}
        />
      ) : null}
      {showTextArea ? (
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
        </>
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
      {loadedTopicData?.length > 0 && (
        <MyContentSection
          translatedText={loadedTopicData}
          pureWordsUnique={pureWordsUnique}
        />
      )}
      <PersonalWordBankStudySection />
      {showLoadedWords ? (
        <div>
          <p>Word list</p>
          <ul>
            {japaneseLoadedWords?.map((japaneseWord) => {
              const baseForm = japaneseWord.baseForm;
              const definition = japaneseWord.definition;
              const phonetic = japaneseWord.phonetic;
              const transliteration = japaneseWord.transliteration;

              return (
                <li key={japaneseWord.id}>
                  <div>
                    <p>
                      {baseForm} --- <span>{definition}</span> ---{' '}
                      <span>{phonetic}</span> ----{' '}
                      <span>{transliteration}</span>
                    </p>
                    <button onClick={handleAddToWordBank}>
                      Add to wordbank
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
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

    return {
      props: {
        japaneseLoadedContent,
        japaneseLoadedWords,
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
