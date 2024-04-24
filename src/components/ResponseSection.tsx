import { useEffect, useRef, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import ResponseCTAs from './ResponseCTAs';
import ResultsAudioActions from './ResultsAudioActions';

const MoreNestedResponse = ({
  detail,
  wordBank,
  handleDeleteSentence,
  handleGetNewSentence,
  mp3Bank,
  setRefs,
  inArrayIndex,
  handleWhatAudioIsPlaying,
  handleWhatAudioIsEnded,
  isNowPlaying,
}) => {
  const [audioUrlIsAvailable, setAudioUrlIsAvailable] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [noKanjiSentence, setNoKanjiSentence] = useState('');
  const [matchedWords, setMatchedWords] = useState([]);
  const [tried, setTried] = useState(false);
  const sentenceRef = useRef();

  const audioFile = '/audio/' + detail.id + '.mp3';

  const japaneseSentence = detail.jap;
  const englishSentence = detail.eng;

  const isAudioInMP3Banks =
    audioUrlIsAvailable ||
    mp3Bank.includes(detail.id + '.mp3') ||
    mp3Bank.includes(detail.jap + '.mp3');

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
      const responseFiles = await fetch('/api/chatgpt-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tts: japaneseSentence, id: detail.id }),
      });

      const availableMP3Files = JSON.parse(await responseFiles.text());

      availableMP3Files.includes(detail.id + '.mp3');
      setAudioUrlIsAvailable(true);
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
      <div
        style={{
          flexWrap: 'wrap',
          display: 'flex',
        }}
      >
        <p
          ref={sentenceRef}
          style={{
            margin: '5px 0',
            background: isNowPlaying === inArrayIndex ? 'yellow' : 'none',
          }}
        >
          {underlinedSentence}
        </p>
        <ResponseCTAs
          loadingResponse={loadingResponse}
          handleDeleteClick={handleDeleteClick}
          handleGetNewSentenceClick={handleGetNewSentenceClick}
          handleGetAudio={handleGetAudio}
          getKanjiFreeSentence={getKanjiFreeSentence}
        />
      </div>
      {noKanjiSentence && <p style={{ margin: '5px 0' }}>{noKanjiSentence}</p>}
      <p style={{ margin: '5px 0' }}>{englishSentence}</p>

      {isAudioInMP3Banks && (
        <AudioPlayer
          mp3AudioFile={audioFile}
          setRefs={setRefs}
          inArrayIndex={inArrayIndex}
          handleWhatAudioIsPlaying={handleWhatAudioIsPlaying}
          handleWhatAudioIsEnded={handleWhatAudioIsEnded}
        />
      )}
    </li>
  );
};

const ResponseItem = ({
  responseItem,
  wordBank,
  handleDeleteSentence,
  handleGetNewSentence,
  mp3Bank,
}) => {
  const [audioRefs, setAudioRefs] = useState([]);
  const [audioToPlay, setAudioToPlay] = useState(0);
  const [isNowPlaying, setIsNowPlaying] = useState();

  const setRefs = (ref, index) => {
    const updatedAudioRefs =
      audioRefs?.length === 0
        ? [{ ref, index }]
        : [...audioRefs, { ref, index }];
    if (updatedAudioRefs?.length === 1) {
      setAudioRefs(updatedAudioRefs);
    } else {
      setAudioRefs(updatedAudioRefs.sort((a, b) => a.index - b.index));
    }
  };

  const setRestart = () => {
    setAudioToPlay(0);
  };

  const handleAudioEnd = (index) => {
    console.log('## Ended? index: ', index);
  };
  const handleAudioPlay = (index) => {
    console.log('## Playing? index: ', index);
  };

  const handleWhatAudioIsPlaying = (index) => {
    setIsNowPlaying(index);
  };

  const handleWhatAudioIsEnded = (index) => {
    setAudioRefs((prevAudioRefs) => {
      const nextInArr = index + 1;
      const triggerNextAudio = nextInArr < prevAudioRefs.length;
      if (triggerNextAudio) {
        setAudioToPlay(nextInArr);
      }
      return prevAudioRefs;
    });
  };
  return (
    <>
      <ResultsAudioActions
        audioRefs={audioRefs}
        handleAudioEnd={handleAudioEnd}
        handleAudioPlay={handleAudioPlay}
        audioToPlay={audioToPlay}
        setRestart={setRestart}
      />
      <div>
        {responseItem.map((detail, index) => {
          return (
            <MoreNestedResponse
              key={index}
              inArrayIndex={index}
              detail={detail}
              wordBank={wordBank}
              handleDeleteSentence={handleDeleteSentence}
              handleGetNewSentence={handleGetNewSentence}
              mp3Bank={mp3Bank}
              setRefs={setRefs}
              handleWhatAudioIsPlaying={handleWhatAudioIsPlaying}
              handleWhatAudioIsEnded={handleWhatAudioIsEnded}
              isNowPlaying={isNowPlaying}
            />
          );
        })}
      </div>
    </>
  );
};
const ResponseSection = ({
  response,
  handleDeleteSentence,
  handleGetNewSentence,
  mp3Bank,
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
              mp3Bank={mp3Bank}
            />
          </div>
        );
      })}
    </ul>
  );
};

export default ResponseSection;
