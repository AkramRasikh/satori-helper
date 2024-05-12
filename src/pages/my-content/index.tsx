import { v4 as uuidv4 } from 'uuid';
import LoadingStatus from '@/components/LoadingStatus';
import MyContentTextArea from '@/components/MyContentTextArea';
import { getThoughtsToBilingualText } from '@/prompts/utils';
import { useState } from 'react';
// import chatGptAPI from './api/chatgpt';
import MyContentSection from '@/components/MyContentSection';
import PersonalWordBankStudySection from '@/components/PersonalWordBankStudySection';
// import saveWordAPI from './api/save-word';
import { useRouter } from 'next/router';
import chatGptAPI from '../api/chatgpt';
import Header from './Header';
import getNarakeetAudio from '../api/narakeet';
import getChatGptTTS from '../api/tts-audio';
import saveContentAPI from '../api/save-content';

export default function MyContentPage() {
  const [isLoadingResponse, setLoadingResponse] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');
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

  const handleMyTextTranslated = async () => {
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
            hasAudio: await getCorrespondingAudio({ ...item, id }, null),
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

  // const saveWordToFirebase = async () => {
  //   try {
  //     setLoadingResponse(true);
  //     const res = await saveWordAPI({
  //       ref: 'japanese',
  //       contentEntry: {
  //         'general-ting-01': translatedText,
  //       },
  //     });
  //     console.log('## Saved!: ', res);
  //   } catch (error) {
  //     //
  //   } finally {
  //     setLoadingResponse(false);
  //   }
  // };

  const saveContentToFirebase = async () => {
    const contentEntry = {
      [themeValue.toLowerCase()]: translatedText,
    };

    try {
      setLoadingResponse(true);
      await saveContentAPI({
        ref: 'japaneseContent',
        contentEntry,
      });
    } catch (error) {
      //
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
      <PersonalWordBankStudySection />
    </div>
  );
}
