import { useEffect } from 'react';

const ResultsAudioActions = ({
  audioRefs,
  audioToPlay,
  setRestart,
  handleAudioPause,
  handleAudioEnd,
  handleAudioPlay,
}) => {
  useEffect(() => {
    if (audioToPlay) {
      audioRefs[audioToPlay].ref.current.play();
    }
  }, [audioRefs, audioToPlay]);

  const handleStartPlay = () => {
    audioRefs[0].ref.current.play();
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <button
        style={{
          margin: 'auto auto auto 10px',
          height: 'fit-content',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={handleStartPlay}
      >
        Play
      </button>
      <button
        style={{
          margin: 'auto auto auto 10px',
          height: 'fit-content',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => handleAudioPause(audioToPlay)}
      >
        Pause
      </button>
      <button
        style={{
          margin: 'auto auto auto 10px',
          height: 'fit-content',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={setRestart}
      >
        Restart
      </button>
    </div>
  );
};

export default ResultsAudioActions;
