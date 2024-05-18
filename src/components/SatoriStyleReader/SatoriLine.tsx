import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useRef } from 'react';
import useSatoriAudio from './useSatoriAudio';

const SatoriLine = ({
  item,
  masterPlay,
  setMasterPlay,
  getSafeText,
  handleHighlight,
  handleDefinition,
  arrIndex,
  theseDefinitionsAreOpen,
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
          borderRadius: '5px',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <button
        onClick={() => handleDefinition(arrIndex)}
        id='check-definitiions'
        style={{
          border: 'none',
          background: 'none',
          borderRadius: '5px',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        🧐
      </button>
      <span
        style={{
          background: isCurrentlyPlaying ? 'yellow' : 'none',
          borderBottom: theseDefinitionsAreOpen ? '1px solid blue' : 'none',
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
