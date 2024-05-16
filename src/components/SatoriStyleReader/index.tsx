import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useRef } from 'react';

const SatoriStyleReader = ({ content }) => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current?.play();
    }
  };
  return (
    <div>
      <h3>Satori Style</h3>
      <div>
        {content?.map((item) => {
          return (
            <div key={item.id} style={{ display: 'inline' }}>
              <button
                onClick={handlePlay}
                id='play-audio'
                style={{
                  border: 'none',
                  background: 'none',
                  margin: '2px',
                  borderRadius: '5px',
                }}
              >
                ▶️
              </button>
              <span>{item.targetLang}</span>
              {item.hasAudio ? (
                <audio
                  ref={audioRef}
                  src={getFirebaseAudioURL(item.hasAudio)}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SatoriStyleReader;
