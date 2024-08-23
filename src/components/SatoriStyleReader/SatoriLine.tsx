import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useRef, useState } from 'react';
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
  seperateLinesMode,
  showAllEnglish,
  isMusic,
  masterRef,
  handleMasterPlaySegment,
  setEditSentence,
}) => {
  const [showEng, setShowEng] = useState(false);
  const audioRef = useRef(null);
  const isCurrentlyPlaying = masterPlay === item.id;

  const { handlePlay, handlePause, isPlaying } = useSatoriAudio({
    masterPlay,
    audioRef: isMusic ? masterRef : audioRef,
    setMasterPlay,
    isCurrentlyPlaying,
    item,
    isMusic,
    handleMasterPlaySegment,
  });

  return (
    <div
      key={item.id}
      style={{ display: seperateLinesMode ? 'block' : 'inline' }}
    >
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
      <button
        onClick={() => setShowEng(!showEng)}
        id='show-eng'
        style={{
          border: 'none',
          background: 'none',
          borderRadius: '5px',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        🇬🇧
      </button>
      <button
        onClick={() => setEditSentence(item.id)}
        id='show-edit'
        style={{
          border: 'none',
          background: 'none',
          borderRadius: '5px',
          padding: '5px',
          cursor: 'pointer',
        }}
      >
        ✍🏽
      </button>
      <div
        style={{
          display: showEng ? 'block' : 'inline',
        }}
      >
        <span
          style={{
            background: isCurrentlyPlaying ? 'yellow' : 'none',
            borderBottom: theseDefinitionsAreOpen ? '1px solid blue' : 'none',
            display: showEng ? 'block' : '',
          }}
          onMouseUp={() => handleHighlight(item.id)}
        >
          {getSafeText(item.targetLang)}
        </span>
        {(showEng || showAllEnglish) && (
          <span
            style={{
              background: isCurrentlyPlaying ? 'yellow' : 'none',
              borderBottom: theseDefinitionsAreOpen ? '1px solid blue' : 'none',
              display: 'block',
            }}
          >
            {' '}
            {item.baseLang}
          </span>
        )}
      </div>
      {item.hasAudio ? (
        <audio ref={audioRef} src={getFirebaseAudioURL(item.hasAudio)} />
      ) : null}
    </div>
  );
};

export default SatoriLine;
