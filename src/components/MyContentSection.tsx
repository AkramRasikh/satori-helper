import { useRef, useState } from 'react';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';

const IndividualSentenceContext = ({ content, pureWordsUnique }) => {
  const [myContentWordBank, setMyContentWordBank] = useState([]);
  const [highlightedWord, setHighlightedWord] = useState('');
  const [savedWords, setSavedWords] = useState([]);

  const handleHighlight = () => {
    const selection = window?.getSelection();
    const highlightedText = selection.toString().trim();
    if (highlightedText !== '') {
      console.log('## Highlighted:', highlightedText);
      setHighlightedWord(highlightedText);
    } else {
      setHighlightedWord('');
    }
  };

  const removeFromHighlightWordBank = (wordToRemove) => {
    if (wordToRemove) {
      setMyContentWordBank(
        myContentWordBank.filter((word) => word !== wordToRemove),
      );
    }
  };

  const saveToWordBank = async () => {
    const firstWord = myContentWordBank[0];
    const contextId = content.id;
    // const finalContentArr = myContentWordBank.map((item) => {
    //   return {
    //     word: item,
    //     contexts: [contextId],
    //     daysReviewed: [], // [new Date]
    //   };
    // });

    await fetch('http://localhost:3001/add-word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: firstWord,
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

  const saveHighlightedWord = () => {
    const selection = window?.getSelection();
    if (highlightedWord && !myContentWordBank.includes(highlightedWord)) {
      setMyContentWordBank((prev) => [...prev, highlightedWord]);
      selection?.removeAllRanges();
    }
  };

  const underlineWordsInSentence = (sentence, thisWordBank) => {
    const masterBank = makeArrayUnique([
      ...thisWordBank,
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
      {underlineWordsInSentence(content.targetLang, myContentWordBank)}
      <p>{content.baseLang}</p>
      {content?.notes && <p>notes: {content.notes}</p>}
      {myContentWordBank?.length > 0 && (
        <p>
          Word bank:{' '}
          {myContentWordBank.map((word, index) => {
            const lastInArr = myContentWordBank?.length - index;
            return (
              <span
                key={index}
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
                  onClick={() => removeFromHighlightWordBank(word)}
                >
                  ❌
                </button>
                <span>{word}</span>
                {!lastInArr && <span>{' ,'}</span>}
              </span>
            );
          })}
        </p>
      )}
      {highlightedWord && (
        <button onClick={saveHighlightedWord}>
          Highlighted word: {highlightedWord}
        </button>
      )}

      {myContentWordBank?.length > 0 && (
        <button onClick={saveToWordBank}>Add words to study bank!</button>
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
