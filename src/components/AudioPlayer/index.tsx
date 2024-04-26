import { useEffect, useRef, useState } from 'react';
import useAudioPlayer from './useAudioPlayer';
import AudioPlayerElement from './AudioPlayerElement';

const AudioPlayer = ({
  mp3AudioFile,
  setRefs,
  inArrayIndex,
  handleWhatAudioIsPlaying,
  handleWhatAudioIsEnded,
  setMasterPlayPressed,
}) => {
  const ref = useRef();

  const { handleRefresh } = useAudioPlayer({
    ref,
    handleWhatAudioIsEnded,
    handleWhatAudioIsPlaying,
    setRefs,
    setMasterPlayPressed,
    inArrayIndex,
  });

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <AudioPlayerElement ref={ref} url={mp3AudioFile} />
      <button
        style={{
          border: 'none',
          borderRadius: '15%',
          margin: 'auto 10px',
          cursor: 'pointer',
        }}
        onClick={handleRefresh}
      >
        🔄
      </button>
    </div>
  );
};

export default AudioPlayer;
