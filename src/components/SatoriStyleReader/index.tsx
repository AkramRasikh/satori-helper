import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useEffect, useRef, useState } from 'react';

const SatoriLine = ({
  item,
  masterPlay,
  setMasterPlay,
  underlineWordsInSentence,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const isCurrentlyPlaying = masterPlay === item.id;

  const audioPlay = () => {
    setIsPlaying(true);
    setMasterPlay(item.id);
  };
  const audioPause = () => {
    setIsPlaying(false);
  };
  const audioEnded = () => {
    setIsPlaying(false);
  };
  const handleAudioError = () => {};

  useEffect(() => {
    if (audioRef.current && !isCurrentlyPlaying) {
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
    }
  }, [masterPlay, audioRef.current]);

  const handlePlay = () => {
    audioRef.current.currentTime = 0;
    audioRef.current?.play();
  };
  const handlePauuse = () => {
    audioRef.current?.pause();
  };

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.addEventListener('play', audioPlay);
      audioRef.current.addEventListener('pause', audioPause);
      audioRef.current.addEventListener('ended', audioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (audioRef?.current) {
        audioRef.current?.removeEventListener('play', audioPlay);
        audioRef.current?.removeEventListener('pause', audioPause);
        audioRef.current?.removeEventListener('ended', audioEnded);
        audioRef.current?.removeEventListener('error', handleAudioError);
      }
    };
  }, [audioRef]);

  return (
    <div key={item.id} style={{ display: 'inline' }}>
      <button
        onClick={isPlaying ? handlePauuse : handlePlay}
        id='play-audio'
        style={{
          border: 'none',
          background: 'none',
          margin: '2px',
          borderRadius: '5px',
        }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <span
        style={{
          background: isCurrentlyPlaying ? 'yellow' : 'none',
        }}
      >
        {underlineWordsInSentence(item.targetLang)}
      </span>
      {item.hasAudio ? (
        <audio ref={audioRef} src={getFirebaseAudioURL(item.hasAudio)} />
      ) : null}
    </div>
  );
};

const SatoriStyleReader = ({
  content,
  topic,
  pureWordsUnique,
  selectedTopicWords,
  handleAddToWordBank,
  getWordsContext,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const underlineWordsInSentence = (sentence) => {
    if (sentence) {
      const pattern = new RegExp(pureWordsUnique.join('|'), 'g');
      const underlinedSentence = sentence?.replace(
        pattern,
        (match) => `<u>${match}</u>`,
      );
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: underlinedSentence,
          }}
          style={{
            margin: '5px 0',
          }}
        />
      );
    }
    return <p>{sentence}</p>;
  };
  return (
    <div>
      <h3>{topic}:</h3>
      <div>
        {content?.map((item) => {
          return (
            <SatoriLine
              key={item.id}
              item={item}
              setMasterPlay={setMasterPlay}
              masterPlay={masterPlay}
              underlineWordsInSentence={underlineWordsInSentence}
            />
          );
        })}
      </div>
      <div>
        {selectedTopicWords?.map((wordFromTopic) => {
          return (
            <JapaneseWordItem
              key={wordFromTopic.id}
              japaneseWord={wordFromTopic}
              handleAddToWordBank={handleAddToWordBank}
              getWordsContext={getWordsContext}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SatoriStyleReader;
