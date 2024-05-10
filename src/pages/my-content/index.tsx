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
  const parts = inputValue?.split('*');

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

      {parts?.length > 0 && (
        <ul>
          {parts.map((part, index) => (
            <li key={index}>{part.trim()}</li>
          ))}
        </ul>
      )}
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
