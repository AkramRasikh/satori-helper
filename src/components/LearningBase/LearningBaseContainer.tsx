import WordDetail from '../WordDetail';

const LearningBaseContainer = ({
  sentenceSnippet,
  isMoreInfoOpen,
  setIsMoreInfoOpen,
  handleFlashCard,
}) => {
  const handleMoreInfo = () => {
    setIsMoreInfoOpen(!isMoreInfoOpen);
  };

  const text = isMoreInfoOpen ? 'Collapse' : 'More info';

  return (
    <div>
      <button
        onClick={handleMoreInfo}
        style={{
          border: 'none',
          padding: '5px',
          borderRadius: '15%',
          cursor: 'pointer',
        }}
      >
        {text}
      </button>
      {isMoreInfoOpen && (
        <WordDetail
          sentenceData={sentenceSnippet}
          handleFlashCard={handleFlashCard}
        />
      )}
    </div>
  );
};

export default LearningBaseContainer;
