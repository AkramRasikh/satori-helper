import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useRef } from 'react';
import useSatoriAudio from './useSatoriAudio';

const SatoriLine = ({
  item,
  masterPlay,
  setMasterPlay,
  getSafeText,
  handleHighlight,
}) => {
  const audioRef = useRef(null);
  const isCurrentlyPlaying = masterPlay === item.id;

  const { handlePlay, handlePause, isPlaying } = useSatoriAudio({
    masterPlay,
    audioRef,
    setMasterPlay,
    isCurrentlyPlaying,
    item,
  });

  return (
    <div key={item.id} style={{ display: 'inline' }}>
      <button
        onClick={isPlaying ? handlePause : handlePlay}
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
        onMouseUp={handleHighlight}
      >
        {getSafeText(item.targetLang)}
      </span>
      {item.hasAudio ? (
        <audio ref={audioRef} src={getFirebaseAudioURL(item.hasAudio)} />
      ) : null}
    </div>
  );
};

export default SatoriLine;
