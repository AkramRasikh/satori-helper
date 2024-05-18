import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { useState } from 'react';
import SatoriLine from './SatoriLine';
import SwitchButton from '../SwitchButton';

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
  const selection = window?.getSelection();

  const {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  } = useHighlightWordToWordBank(content, pureWordsUnique, selection);

  const savedWordsDefinition = selectedTopicWords.filter(
    (word) =>
      word.baseForm === highlightedWord || word.surfaceForm === highlightedWord,
  );

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
          <p>
            Send Word to DB:{' '}
            <span
              style={{
                margin: '5px',
              }}
            >
              <button
                style={{
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
                onClick={removeFromHighlightWordBank}
              >
                Remove word ❌
              </button>
              <span>{highlightedWord}</span>
              <button
                style={{
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
                onClick={saveToWordBank}
              >
                Add word 🤙🏽
              </button>
            </span>
          </p>
        )}
      </div>
      <div>
        {content?.map((item) => {
          return (
            <SatoriLine
              key={item.id}
              item={item}
              setMasterPlay={setMasterPlay}
              masterPlay={masterPlay}
              getSafeText={getSafeText}
              handleHighlight={handleHighlight}
            />
          );
        })}
      </div>
      {savedWordsDefinition?.map((wordFromTopic) => (
        <JapaneseWordItem
          key={wordFromTopic.id}
          japaneseWord={wordFromTopic}
          handleAddToWordBank={handleAddToWordBank}
          getWordsContext={getWordsContext}
        />
      ))}
    </div>
  );
};

export default SatoriStyleReader;
