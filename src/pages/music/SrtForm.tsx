const SrtForm = ({
  audioName,
  handleFileName,
  lyricsUrl,
  handleLyricsUrl,
  handleSRTSubmit,
}) => {
  return (
    <form>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <div
          style={{
            gap: 20,
            display: 'flex',
            justifyContent: 'center',
            margin: '10px',
          }}
        >
          <div>
            <label htmlFor='audioName'>Audio name:</label>
            <input
              id='audioName'
              type='text'
              value={audioName}
              onChange={handleFileName}
            />
          </div>
          <div>
            <label htmlFor='lyricsUrl'>Audio url:</label>
            <input
              id='lyricsUrl'
              type='text'
              value={lyricsUrl}
              onChange={handleLyricsUrl}
            />
          </div>
          <button
            type='submit'
            disabled={!audioName || !lyricsUrl}
            onClick={handleSRTSubmit}
          >
            Upload
          </button>
        </div>
      </div>
    </form>
  );
};

export default SrtForm;
