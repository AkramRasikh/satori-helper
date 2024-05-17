import { useRef } from 'react';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';

const IndividualSentenceContext = ({ content, pureWordsUnique }) => {
  const selection = window?.getSelection();
  const {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    highlightedWord,
    removeFromHighlightWordBank,
  } = useHighlightWordToWordBank(content, pureWordsUnique, selection);

  const getSafeText = () => {
    const text = underlineWordsInSentence(content.targetLang);
    if (text) {
      return (
        <p
          dangerouslySetInnerHTML={{ __html: text }}
          style={{
            margin: '5px 0',
          }}
        />
      );
    }
    return <p>{text}</p>;
  };
  return (
    <div onMouseUp={handleHighlight}>
      {getSafeText()}
      <p>{content.baseLang}</p>
      {content?.notes && <p>notes: {content.notes}</p>}
      {highlightedWord && (
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
  );
};

const MyContentSectionContainer = ({ item, pureWordsUnique }) => {
  const ref = useRef();
  return (
    <li>
      <IndividualSentenceContext
        content={item}
        pureWordsUnique={pureWordsUnique}
      />
      <AudioPlayerElement url={getFirebaseAudioURL(item.id)} ref={ref} />
    </li>
  );
};

const MyContentSection = ({ translatedText, pureWordsUnique }) => {
  return (
    <div>
      <ul style={{ padding: 0, listStyleType: 'none' }}>
        {translatedText.content?.map((item, index) => {
          return (
            <MyContentSectionContainer
              key={index}
              item={item}
              pureWordsUnique={pureWordsUnique}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default MyContentSection;
