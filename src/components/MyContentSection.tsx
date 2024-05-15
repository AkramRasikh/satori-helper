import { useRef, useState } from 'react';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';

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

    await fetch('http://localhost:3001/add-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: highlightedWord,
        contexts: [contextId],
      }),
    })
      .then(async (response) => {
        const res = await response.json();

        const wordAdded = res.word;

        setSavedWords((prev) =>
          prev?.length === 0 ? [wordAdded] : [...prev, wordAdded],
        );
        return res;
      })
      .catch((error) => console.error('## saveToWordBank Error:', error));
  };
  const makeArrayUnique = (array) => [...new Set(array)];

  const underlineWordsInSentence = (sentence) => {
    const masterBank = makeArrayUnique([
      ...highlightedWord,
      ...savedWords,
      ...pureWordsUnique,
    ]);
    if (masterBank?.length === 0) return <p>{sentence}</p>;
    if (sentence) {
      const pattern = new RegExp(masterBank.join('|'), 'g');
      console.log('## pattern: ', pattern);

      const underlinedSentence = sentence?.replace(
        pattern,
        (match) => `<u>${match}</u>`,
      );
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: underlinedSentence,
          }}
          style={{
            margin: '5px 0',
            // background: isNowPlaying === inArrayIndex ? 'yellow' : 'none',
          }}
        />
      );
    }
    return <p>{sentence}</p>;
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
                fontSize: 10,
                borderRadius: '5px',
                padding: '5px',
                marginRight: '5px',
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
                fontSize: 10,
                borderRadius: '5px',
                padding: '5px',
                marginRight: '5px',
                cursor: 'pointer',
              }}
              onClick={saveToWordBank}
            >
              Add word! 🍄
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
