const ResultsAudioActions = ({ audioRefs }) => {
  const playAudio = () => {
    audioRefs[0].current.play();
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
        onClick={playAudio}
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
      >
        Pause
      </button>
    </div>
  );
};

export default ResultsAudioActions;
