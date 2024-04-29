import { useEffect, useRef, useState } from 'react';
import ResponseCTAs from '../ResponseCTAs';
import AudioPlayer from '../AudioPlayer';
import getChatGptTTS from '@/pages/api/tts-audio';

const ResponseSectionContentContainer = ({
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
  setMasterPlayPressed,
}) => {
  const [audioUrlIsAvailable, setAudioUrlIsAvailable] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [noKanjiSentence, setNoKanjiSentence] = useState('');
  const [matchedWords, setMatchedWords] = useState([]);
  const [tried, setTried] = useState(false);
  const sentenceRef = useRef();

  const baseAssetsURL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
  const audioFile = baseAssetsURL + '/audio/' + detail.id + '.mp3';

  const japaneseSentence = detail.targetLang;
  const englishSentence = detail.eng;

  const isAudioInMP3Banks =
    audioUrlIsAvailable ||
    mp3Bank.includes(detail.id + '.mp3') ||
    mp3Bank.includes(detail.targetLang + '.mp3');

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

    if (sentenceRef?.current) {
      setTimeout(
        () => (sentenceRef.current.innerHTML = underlinedSentence),
        100,
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
      setLoadingResponse(true);
      const mp3FilesOnServer = await getChatGptTTS({
        id: detail.id,
        sentence: japaneseSentence,
      });

      mp3FilesOnServer.includes(detail.id + '.mp3');
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
          setMasterPlayPressed={setMasterPlayPressed}
        />
      )}
    </li>
  );
};
export default ResponseSectionContentContainer;
