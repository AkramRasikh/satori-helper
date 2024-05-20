const ResponseCTAs = ({
  loadingResponse,
  handleDeleteClick,
  handleGetAudio,
  getKanjiFreeSentence,
  handleSaveToSatori,
  isAudioInMP3Banks,
  handleGetNarakeetAudioFunc,
}) => {
  const getAudioCta = {
    text: 'Get Audio',
    onClickHandler: handleGetAudio,
  };
  const ctaArr = [
    {
      text: 'Delete',
      onClickHandler: handleDeleteClick,
    },
    {
      text: 'Remove Kanji',
      onClickHandler: getKanjiFreeSentence,
    },
    {
      text: 'Save sentence',
      onClickHandler: handleSaveToSatori,
    },
    {
      text: 'Get Narakeet',
      onClickHandler: handleGetNarakeetAudioFunc,
    },
  ];

  // Conditionally add the "Get Audio" button if isAudioInMP3Banks is false
  if (!isAudioInMP3Banks) {
    ctaArr.push(getAudioCta);
  }
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
