import { useState } from 'react';

const MyContentSection = ({ translatedText }) => {
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
    console.log('## myContentWordBank: ', myContentWordBank);

    await fetch('/api/save-to-wordbank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(myContentWordBank),
    })
      .then(async (response) => {
        const jsonED = await response.json();
        console.log('## saveToWordBank jsonED: ', jsonED);

        return jsonED;
      })
      .then((data) => console.log('## saveToWordBank then data: ', data))
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
    <div id='textContainer' onMouseUp={handleHighlight}>
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

      <ul>
        {translatedText?.map((item, index) => {
          return (
            <li key={index}>
              <div>
                <p>targetLang: {item.targetLang}</p>
                <p>baseLang: {item.baseLang}</p>
                <p>notes: {item.notes}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyContentSection;
