import MyContentTextArea from '@/components/MyContentTextArea';
import ContentActions from './ContentActions';

const ContentCreationSection = ({
  setInputValue,
  setThemeValue,
  handleMyTextTranslated,
  saveContentToFirebase,
  themeValue,
  inputValue,
}) => {
  const parts = inputValue?.split('\n');

  return (
    <>
      <MyContentTextArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        themeValue={themeValue}
        setThemeValue={setThemeValue}
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

export default ContentCreationSection;
