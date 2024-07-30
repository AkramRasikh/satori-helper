import MyContentTextArea from '@/components/MyContentTextArea';
import ContentActions from './ContentActions';
import BilingualSwitch from './BilingualSwitch';

const isOddNumber = (number) => number % 2 !== 0;

const ContentCreationSection = ({
  setInputValue,
  setThemeValue,
  handleMyTextTranslated,
  saveContentToFirebase,
  themeValue,
  inputValue,
  setIsBilingualContentMode,
  isBilingualContentMode,
}) => {
  const parts = inputValue?.split('\n');

  return (
    <>
      <BilingualSwitch
        setIsBilingualContentMode={setIsBilingualContentMode}
        isBilingualContentMode={isBilingualContentMode}
      />
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
        isBilingualContentMode={isBilingualContentMode}
      />
      {inputValue && (
        <ul>
          {parts.map((part, index) => {
            const langEmoji = isOddNumber(index) ? '🇬🇧' : '🇯🇵';
            return (
              <li key={index}>
                {isBilingualContentMode ? <span>{langEmoji}: </span> : null}
                {part.trim()}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default ContentCreationSection;
