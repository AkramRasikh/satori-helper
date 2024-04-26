const LearningContentDetailCardsCTAs = ({ handleFlashCard, cardId }) => {
  const handleFlashCardFunc = (flashCardNumber) => {
    handleFlashCard(flashCardNumber, cardId);
  };
  const ctaArr = [
    {
      text: 'Incorrect',
      title: 'No point, just make a bloodclart sentence!',
      onClickHandler: () => {},
      disabled: true,
    },
    {
      text: 'Hard',
      onClickHandler: () => handleFlashCardFunc(3),
    },
    {
      text: 'Medium',
      onClickHandler: () => handleFlashCardFunc(4),
    },
    {
      text: 'Easy',
      onClickHandler: () => handleFlashCardFunc(5),
    },
  ];
  return (
    <div
      style={{
        marginTop: '10px',
      }}
    >
      {ctaArr.map((cta, index) => {
        return (
          <button
            key={index}
            style={{
              border: 'none',
              borderRadius: '15px',
              padding: '10px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
            title={cta?.title}
            disabled={cta?.disabled}
            onClick={cta.onClickHandler}
          >
            {cta.text}
          </button>
        );
      })}
    </div>
  );
};

export default LearningContentDetailCardsCTAs;
