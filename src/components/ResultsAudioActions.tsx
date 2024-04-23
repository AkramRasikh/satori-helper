const ResultsAudioActions = () => {
  return (
    <div style={{ marginBottom: '20px' }}>
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
