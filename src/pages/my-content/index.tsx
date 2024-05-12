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

const japaneseContent = 'japaneseContent';

export default function MyContentPage(props) {
  const japaneseLoadedContent = props?.japaneseLoadedContent;
  const topics = Object.keys(japaneseLoadedContent);

  const [isLoadingResponse, setLoadingResponse] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');
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
      console.log('## fullPrompt: ', fullPrompt);
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
      console.log('## handleMyTextTranslated, error');
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleTopicLoad = (topic) => {
    setLoadedTopicData(japaneseLoadedContent[topic]);
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
  const parts = inputValue?.split('\n');

  return (
    <div
      style={{
        padding: '15px',
      }}
    >
      <Header handleNavigateToMyContent={handleNavigateToMyContent} />
      {isLoadingResponse && <LoadingStatus />}
      {topics?.length ? (
        <LoadContentControls
          topics={topics}
          handleTopicLoad={handleTopicLoad}
        />
      ) : null}
      <MyContentTextArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        themeValue={themeValue}
        setThemeValue={setThemeValue}
        translatedText={translatedText}
      />
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
            padding: '5px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Translate content + Nara
        </button>
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
        <MyContentSection translatedText={loadedTopicData} />
      )}
      <PersonalWordBankStudySection />
    </div>
  );
}

export async function getStaticProps() {
  try {
    const japaneseLoadedContent = await loadInContent({
      ref: japaneseContent,
    });

    return {
      props: {
        japaneseLoadedContent,
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
