import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { useState } from 'react';
import SatoriLine from './SatoriLine';
import SwitchButton from '../SwitchButton';
import SatoriHighlightReviewActions from './SatoriHighlightReviewActions';

const SatoriStyleReader = ({
  content,
  topic,
  pureWordsUnique,
  selectedTopicWords,
  handleAddToWordBank,
  getWordsContext,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [isInHighlightMode, setIsInHighlightMode] = useState(false);
  const [thisSentenceStudyWordsIndex, setThisSentenceStudyWordsIndex] =
    useState();
  const selection = window?.getSelection();

  const {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  } = useHighlightWordToWordBank(content, pureWordsUnique, selection);

  const getThisSentenceStudyWords = () => {
    if (typeof thisSentenceStudyWordsIndex !== 'number') return null;

    const thisLine = content[thisSentenceStudyWordsIndex].targetLang;
    const wordsFromThisSentence = selectedTopicWords.filter(
      (word) =>
        thisLine.includes(word.baseForm) || thisLine.includes(word.surfaceForm),
    );
    return wordsFromThisSentence;
  };

  const handleDefinition = (index) => {
    if (index === thisSentenceStudyWordsIndex) {
      setThisSentenceStudyWordsIndex(undefined);
    } else {
      setThisSentenceStudyWordsIndex(index);
    }
  };

  const thisSentenceStudyWords = getThisSentenceStudyWords();

  const getSafeText = (targetText) => {
    const text = underlineWordsInSentence(targetText, isInHighlightMode);

    return (
      <p
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          margin: '5px 0',
          display: 'inline',
        }}
      />
    );
  };

  return (
    <div>
      <h3
        style={{
          textAlign: 'center',
          margin: '0',
        }}
      >
        {topic}:
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ margin: 'auto' }}>
            <span>{isInHighlightMode ? 'Highlight mode' : 'Review mode'}</span>
          </div>
          <SwitchButton
            isOn={isInHighlightMode}
            setIsOn={setIsInHighlightMode}
          />
        </div>
        {highlightedWord && isInHighlightMode && (
          <SatoriHighlightReviewActions
            removeFromHighlightWordBank={removeFromHighlightWordBank}
            highlightedWord={highlightedWord}
            saveToWordBank={saveToWordBank}
          />
        )}
      </div>
      <div>
        {content?.map((item, index) => {
          return (
            <SatoriLine
              key={item.id}
              item={item}
              setMasterPlay={setMasterPlay}
              masterPlay={masterPlay}
              getSafeText={getSafeText}
              handleHighlight={handleHighlight}
              handleDefinition={handleDefinition}
              arrIndex={index}
              theseDefinitionsAreOpen={
                index === thisSentenceStudyWordsIndex &&
                thisSentenceStudyWords?.length > 0
              }
            />
          );
        })}
      </div>
      {thisSentenceStudyWords?.map((wordFromTopic) => (
        <JapaneseWordItem
          key={wordFromTopic.id}
          japaneseWord={wordFromTopic}
          handleAddToWordBank={handleAddToWordBank}
          getWordsContext={getWordsContext}
        />
      ))}
      {/* {savedWordsDefinition?.map((wordFromTopic) => (
        <JapaneseWordItem
          key={wordFromTopic.id}
          japaneseWord={wordFromTopic}
          handleAddToWordBank={handleAddToWordBank}
          getWordsContext={getWordsContext}
        />
      ))} */}
    </div>
  );
};

export default SatoriStyleReader;
