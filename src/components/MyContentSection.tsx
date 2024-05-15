import { useRef, useState } from 'react';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { makeArrayUnique } from '@/utils/makeArrayUnique';

const IndividualSentenceContext = ({ content, pureWordsUnique }) => {
  const [highlightedWord, setHighlightedWord] = useState('');
  const [savedWords, setSavedWords] = useState([]);

  const handleHighlight = () => {
    const selection = window?.getSelection();
    const highlightedText = selection.toString().trim();
    if (highlightedText !== '') {
      setHighlightedWord(highlightedText);
    }
  };

  const removeFromHighlightWordBank = () => {
    setHighlightedWord('');
  };

  const saveToWordBank = async () => {
    const contextId = content.id;

    try {
      const response = await fetch('http://localhost:3001/add-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: highlightedWord,
          contexts: [contextId],
        }),
      });
      const res = await response.json();

      const wordAdded = res.word;

      setSavedWords((prev) =>
        prev?.length === 0 ? [wordAdded] : [...prev, wordAdded],
      );
    } catch (error) {
      console.error('## saveToWordBank Error:', error);
    } finally {
      removeFromHighlightWordBank();
    }
  };

  const underlineWordsInSentence = (sentence) => {
    const masterBank = makeArrayUnique([
      ...savedWords,
      ...pureWordsUnique,
      highlightedWord,
    ]);
    if (masterBank?.length === 0) return <p>{sentence}</p>;

    const pattern = new RegExp(masterBank.join('|'), 'g');

    const underlinedSentence = sentence?.replace(pattern, (match) => {
      if (match === highlightedWord) {
        return `<span style="color:goldenrod">${match}</span>`;
      }

      return `<u>${match}</u>`;
    });

    return (
      <p
        dangerouslySetInnerHTML={{
          __html: underlinedSentence,
        }}
        style={{
          margin: '5px 0',
        }}
      />
    );
  };

  return (
    <div onMouseUp={handleHighlight}>
      {underlineWordsInSentence(content.targetLang)}
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
        {translatedText?.map((item, index) => {
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
