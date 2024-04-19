import { useEffect, useRef, useState } from 'react';

const MoreNestedResponse = ({ detail, wordBank }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [matchedWords, setMatchedWords] = useState([]);
  const [tried, setTried] = useState(false);
  const sentenceRef = useRef();

  let japaneseBareText = '';
  const japaneseRegex = /\[JP\]/;
  const isJapaneseText = japaneseRegex.test(detail);

  if (isJapaneseText) {
    japaneseBareText = detail.replace(japaneseRegex, '');
  }

  function underlineWordsInSentence(sentence) {
    // Create a regular expression pattern to match any of the words
    const pattern = new RegExp(matchedWords.join('|'), 'g');

    // Replace each matched word with an underlined version
    const underlinedSentence = sentence.replace(
      pattern,
      (match) => `<u>${match}</u>`,
    );

    sentenceRef.current.innerHTML = underlinedSentence;
  }

  useEffect(() => {
    const fetchKuromojiDictionary = async () => {
      try {
        const response = await fetch('/api/kuromoji', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            japaneseSentence: japaneseBareText,
            targetWords: wordBank,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const resText = JSON.parse(await response.text());

        setMatchedWords(resText);
        setTried(true);
      } catch (error) {
        console.error('Error fetching Kuromoji dictionary:', error);
        throw error;
      }
    };
    if (japaneseBareText && !tried && matchedWords?.length === 0) {
      fetchKuromojiDictionary();
    }
  }, [japaneseBareText, matchedWords?.length, tried, wordBank]);

  const handleGetAudio = async () => {
    if (!japaneseBareText) return null;
    try {
      // figure reference to code
      setLoadingResponse(true);
      await fetch('/api/chatgpt-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tts: japaneseBareText }),
      });
      setAudioUrl('/audio/' + japaneseBareText + '.mp3');
    } catch (error) {
      console.error('## Error fetching data:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  if (!detail) {
    return null;
  }

  const underlinedSentence =
    isJapaneseText &&
    matchedWords?.length > 0 &&
    japaneseBareText &&
    sentenceRef
      ? underlineWordsInSentence(japaneseBareText)
      : detail;

  return (
    <li>
      <div style={{ display: 'flex' }}>
        <p ref={sentenceRef}>{underlinedSentence}</p>
        {isJapaneseText && (
          <button
            style={{
              margin: 'auto auto auto 10px',
              height: 'fit-content',
              padding: '5px',
              borderRadius: '15px',
              border: 'none',
              cursor: 'pointer',
            }}
            disabled={loadingResponse}
            onClick={handleGetAudio}
          >
            Get Audio
          </button>
        )}
      </div>
      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </li>
  );
};

const ResponseItem = ({ responseItem, wordBank }) => {
  return (
    <div style={{ borderTop: '1px solid grey' }}>
      {responseItem.split('\n').map((detail, index) => {
        return (
          <MoreNestedResponse key={index} detail={detail} wordBank={wordBank} />
        );
      })}
    </div>
  );
};
const ResponseSection = ({ response }) => {
  return (
    <ul style={{ borderBottom: '1px solid grey' }}>
      {response.map((responseItem, index) => {
        const wordBank = responseItem.wordBank;
        const response = responseItem.response;
        return (
          <ResponseItem
            key={index}
            responseItem={response}
            wordBank={wordBank}
          />
        );
      })}
    </ul>
  );
};

export default ResponseSection;
