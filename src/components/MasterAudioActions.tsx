import { useEffect } from 'react';

const MasterAudioActions = ({
  audioRefs,
  audioToPlay,
  setRestart,
  handleAudioPause,
  masterPlayPressed,
  setMasterPlayPressed,
  // handleAudioEnd,
  // handleAudioPlay,
}) => {
  useEffect(() => {
    if (audioToPlay && masterPlayPressed) {
      setTimeout(() => audioRefs[audioToPlay].ref.current.play(), 300);
    }
  }, [audioRefs, audioToPlay, masterPlayPressed]);

  const handleStartPlay = () => {
    audioRefs[0].ref.current.play();
    setMasterPlayPressed(true);
  };

  const ctaArr = [
    {
      text: 'Play',
      onClickHandler: handleStartPlay,
    },
    {
      text: 'Pause',
      onClickHandler: () => handleAudioPause(audioToPlay),
    },
    {
      text: 'Restart',
      onClickHandler: setRestart,
    },
  ];

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      {ctaArr.map((cta, index) => {
        return (
          <button
            key={index}
            style={{
              margin: 'auto auto auto 10px',
              height: 'fit-content',
              padding: '15px',
              borderRadius: '15px',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={cta.onClickHandler}
          >
            {cta.text}
          </button>
        );
      })}
    </div>
  );
};

export default MasterAudioActions;
