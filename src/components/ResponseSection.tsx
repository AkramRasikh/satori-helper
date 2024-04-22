import { useEffect, useRef, useState } from 'react';
import AudioPlayer from './AudioPlayer';

const MoreNestedResponse = ({
  detail,
  wordBank,
  handleDeleteSentence,
  handleGetNewSentence,
}) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [noKanjiSentence, setNoKanjiSentence] = useState('');
  const [matchedWords, setMatchedWords] = useState([]);
  const [tried, setTried] = useState(false);
  const sentenceRef = useRef();

  const bulkAudioFormat = '/audio/' + detail.id + '.mp3';

  const mp3AudioFile = bulkAudioFormat || audioUrl;

  const japaneseSentence = detail.jap;
  const englishSentence = detail.eng;

  const handleDeleteClick = () => {
    handleDeleteSentence(detail.id);
  };

  const handleGetNewSentenceClick = () => {
    handleGetNewSentence(detail, matchedWords);
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

  const getKanjiFreeSentence = async () => {
    try {
      setLoadingResponse(true);
      const response = await fetch('/api/kanji-to-hiragana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          japaneseSentence: japaneseSentence,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const resText = JSON.parse(await response.text());

      setNoKanjiSentence(resText.sentence);
    } catch (error) {
      console.error('Error fetching Kuromoji dictionary:', error);
      throw error;
    } finally {
      setLoadingResponse(false);
    }
  };

  if (!detail) {
    return null;
  }

  const underlinedSentence = underlineWordsInSentence(japaneseSentence);

  return (
    <li style={{ marginBottom: '10px' }}>
      <div style={{ flexWrap: 'wrap', display: 'flex' }}>
        <p ref={sentenceRef} style={{ margin: '5px 0' }}>
          {underlinedSentence}
        </p>
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
            onClick={handleDeleteClick}
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
            onClick={handleGetNewSentenceClick}
          >
            Redo
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
            onClick={getKanjiFreeSentence}
          >
            Remove Kanji
          </button>
        </div>
      </div>
      {noKanjiSentence && <p style={{ margin: '5px 0' }}>{noKanjiSentence}</p>}
      <p style={{ margin: '5px 0' }}>{englishSentence}</p>

      {mp3AudioFile && (
        <AudioPlayer id={`audio-${detail.id}`} mp3AudioFile={mp3AudioFile} />
      )}
    </li>
  );
};

const ResponseItem = ({
  responseItem,
  wordBank,
  handleDeleteSentence,
  handleGetNewSentence,
}) => {
  return (
    <div>
      {responseItem.map((detail, index) => {
        return (
          <MoreNestedResponse
            key={index}
            detail={detail}
            wordBank={wordBank}
            handleDeleteSentence={handleDeleteSentence}
            handleGetNewSentence={handleGetNewSentence}
          />
        );
      })}
    </div>
  );
};
const ResponseSection = ({
  response,
  handleDeleteSentence,
  handleGetNewSentence,
}) => {
  return (
    <ul style={{ borderBottom: '1px solid grey' }}>
      {response.map((responseItem, index) => {
        const wordBank = responseItem.wordBank;
        const response = responseItem.response;

        return (
          <div key={index} style={{ borderTop: '1px solid grey' }}>
            <h3 style={{ textAlign: 'center' }}>
              Words in this response:{' '}
              {wordBank.map((word, indexWord) => (
                <span key={indexWord}>
                  {word}
                  {indexWord === wordBank.length - 1 ? '' : ', '}
                </span>
              ))}
            </h3>
            <ResponseItem
              responseItem={response}
              wordBank={wordBank}
              handleDeleteSentence={handleDeleteSentence}
              handleGetNewSentence={handleGetNewSentence}
            />
          </div>
        );
      })}
    </ul>
  );
};

export default ResponseSection;
