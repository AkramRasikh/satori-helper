import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useEffect, useRef, useState } from 'react';

const SatoriLine = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const audioPlay = () => {
    console.log('## SatoriLine audioPlay');
    setIsPlaying(true);
  };
  const audioPause = () => {
    console.log('## SatoriLine audioPause');
    setIsPlaying(false);
  };
  const audioEnded = () => {
    console.log('## SatoriLine audioEnded');
    setIsPlaying(false);
  };
  const handleAudioError = () => {
    console.log('## SatoriLine handleAudioError');
  };

  const handlePlay = () => {
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
      <span>{item.targetLang}</span>
      {item.hasAudio ? (
        <audio ref={audioRef} src={getFirebaseAudioURL(item.hasAudio)} />
      ) : null}
    </div>
  );
};

const SatoriStyleReader = ({ content }) => {
  return (
    <div>
      <h3>Satori Style</h3>
      <div>
        {content?.map((item) => {
          return <SatoriLine key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

export default SatoriStyleReader;
