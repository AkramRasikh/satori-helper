const ResponseCTAs = ({
  loadingResponse,
  handleDeleteClick,
  handleGetNewSentenceClick,
  handleGetAudio,
  getKanjiFreeSentence,
}) => (
  <div style={{ margin: 'auto 0' }}>
    <button
      style={{
        margin: 'auto auto auto 10px',
        height: 'fit-content',
        padding: '5px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
      }}
      disabled={loadingResponse}
      onClick={handleDeleteClick}
    >
      Delete
    </button>
    <button
      style={{
        margin: 'auto auto auto 10px',
        height: 'fit-content',
        padding: '5px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
      }}
      disabled={loadingResponse}
      onClick={handleGetNewSentenceClick}
    >
      Redo
    </button>
    <button
      style={{
        margin: 'auto auto auto 10px',
        height: 'fit-content',
        padding: '5px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
      }}
      disabled={loadingResponse}
      onClick={handleGetAudio}
    >
      Get Audio
    </button>
    <button
      style={{
        margin: 'auto auto auto 10px',
        height: 'fit-content',
        padding: '5px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
      }}
      disabled={loadingResponse}
      onClick={getKanjiFreeSentence}
    >
      Remove Kanji
    </button>
  </div>
);

export default ResponseCTAs;
