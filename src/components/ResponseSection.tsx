import { useEffect, useRef, useState } from 'react';

const MoreNestedResponse = ({ detail, wordBank }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [matchedWords, setMatchedWords] = useState([]);
  const [tried, setTried] = useState(false);
  const sentenceRef = useRef();

  const japaneseSentence = detail.jap;
  const englishSentence = detail.eng;

  const handleDeleteSentence = () => {
    console.log('## handleDeleteSentence');
  };

  function underlineWordsInSentence(sentence) {
    const pattern = new RegExp([...matchedWords, ...wordBank].join('|'), 'g');

    const underlinedSentence = sentence.replace(
      pattern,
      (match) => `<u>${match}</u>`,
    );

    if (sentenceRef.current) {
      setTimeout(
        () => (sentenceRef.current.innerHTML = underlinedSentence),
        200,
      );
    }
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
            japaneseSentence: japaneseSentence,
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
    if (japaneseSentence && !tried && matchedWords?.length === 0) {
      fetchKuromojiDictionary();
    }
  }, [japaneseSentence, matchedWords?.length, tried, wordBank]);

  const handleGetAudio = async () => {
    if (!japaneseSentence) return null;
    try {
      // figure reference to code
      setLoadingResponse(true);
      await fetch('/api/chatgpt-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tts: japaneseSentence }),
      });
      setAudioUrl('/audio/' + japaneseSentence + '.mp3');
    } catch (error) {
      console.error('## Error fetching data:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  if (!detail) {
    return null;
  }

  const underlinedSentence = underlineWordsInSentence(japaneseSentence);

  return (
    <li>
      <div style={{ display: 'flex' }}>
        <p ref={sentenceRef}>{underlinedSentence}</p>
        <div style={{ margin: 'auto 0' }}>
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
            onClick={handleDeleteSentence}
          >
            Delete
          </button>
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
        </div>
      </div>
      <p>{englishSentence}</p>

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
      {responseItem.map((detail, index) => {
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
