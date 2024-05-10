import { v4 as uuidv4 } from 'uuid';
import LoadingStatus from '@/components/LoadingStatus';
import TextInput from '@/components/TextInput';
import { getThoughtsToBilingualText } from '@/prompts/utils';
import { useState } from 'react';
import chatGptAPI from './api/chatgpt';
import MyContentSection from '@/components/MyContentSection';
import PersonalWordBankStudySection from '@/components/PersonalWordBankStudySection';
import saveWordAPI from './api/save-word';
import { useRouter } from 'next/router';

export default function MyContentPage() {
  const [isLoadingResponse, setLoadingResponse] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [themeValue, setThemeValue] = useState('');
  const [translatedText, setTranslatedText] = useState([]);
  const router = useRouter();

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

  const handleNavigateToMyContent = () => {
    router.push('/');
  };

  const saveContentToFirebase = async () => {};

  return (
    <div>
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
          }}
          onClick={handleNavigateToMyContent}
        >
          /home
        </button>
      </div>
      {isLoadingResponse && <LoadingStatus />}

      <TextInput
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
      )}
      <PersonalWordBankStudySection />
    </div>
  );
}
