import AudioPlayerElement from '../AudioPlayer/AudioPlayerElement';

const SatoriAudioControls = ({
  handleAudioJump,
  unifiedAudioRef,
  topic,
  reloadURL,
  getUrl,
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <div
        style={{
          display: 'flex',
          marginRight: '10px',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={reloadURL}
          style={{
            margin: 'auto',
            height: 'fit-content',
            padding: '5px',
            borderRadius: '15px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>

        <button
          onClick={() => handleAudioJump(true)}
          style={{
            margin: 'auto',
            height: 'fit-content',
            padding: '15px',
            borderRadius: '15px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ⏪ - 5
        </button>
        <button
          onClick={() => handleAudioJump(false)}
          style={{
            margin: 'auto',
            height: 'fit-content',
            padding: '15px',
            borderRadius: '15px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ⏩ + 5
        </button>
      </div>
      <AudioPlayerElement ref={unifiedAudioRef} url={getUrl(topic)} />
    </div>
  );
};

export default SatoriAudioControls;
