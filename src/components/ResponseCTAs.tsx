const ResponseCTAs = ({
  loadingResponse,
  handleDeleteClick,
  handleGetNewSentenceClick,
  handleGetAudio,
  getKanjiFreeSentence,
}) => {
  const ctaArr = [
    {
      text: 'Delete',
      onClickHandler: handleDeleteClick,
    },
    {
      text: 'Redo',
      onClickHandler: handleGetNewSentenceClick,
    },
    {
      text: 'Get Audio',
      onClickHandler: handleGetAudio,
    },
    {
      text: 'Remove Kanji',
      onClickHandler: getKanjiFreeSentence,
    },
  ];
  return (
    <div style={{ margin: 'auto 0' }}>
      {ctaArr.map((cta, index) => {
        return (
          <button
            key={index}
            style={{
              margin: 'auto auto auto 10px',
              height: 'fit-content',
              padding: '5px',
              borderRadius: '15px',
              border: 'none',
              cursor: 'pointer',
            }}
            disabled={loadingResponse}
            onClick={cta.onClickHandler}
          >
            {cta.text}
          </button>
        );
      })}
    </div>
  );
};

export default ResponseCTAs;
