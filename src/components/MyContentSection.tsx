import { useState } from 'react';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';

const IndividualSentenceContext = ({ content }) => {
  const [myContentWordBank, setMyContentWordBank] = useState([]);
  const [highlightedWord, setHighlightedWord] = useState('');

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

  const saveToWordBank = async () => {
    const contextId = content.id;
    const finalContentArr = myContentWordBank.map((item) => {
      return {
        word: item,
        contexts: [contextId],
        daysReviewed: [], // [new Date]
      };
    });

    await fetch('/api/save-to-wordbank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalContentArr),
    })
      .then(async (response) => {
        const jsonED = await response.json();
        return jsonED;
      })
      .catch((error) => console.error('## saveToWordBank Error:', error));
  };

  const saveHighlightedWord = () => {
    const selection = window?.getSelection();
    if (highlightedWord) {
      setMyContentWordBank((prev) => [...prev, highlightedWord]);
      selection?.removeAllRanges();
    }
  };

  return (
    <div onMouseUp={handleHighlight}>
      <p>{content.targetLang}</p>
      <p>{content.baseLang}</p>
      {content?.notes && <p>notes: {content.notes}</p>}
      {myContentWordBank?.length > 0 && (
        <p>
          Word bank:{' '}
          {myContentWordBank.map((word) => (
            <span>{word}, </span>
          ))}
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

const MyContentSection = ({ translatedText }) => {
  return (
    <div>
      <ul style={{ padding: 0, listStyleType: 'none' }}>
        {translatedText?.map((item, index) => {
          return (
            <li key={index}>
              <IndividualSentenceContext content={item} />
              <AudioPlayerElement url={getFirebaseAudioURL(item.id)} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyContentSection;
