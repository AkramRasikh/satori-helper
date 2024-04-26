import LearningContentDetail from '../LearningContentDetail';

const LearningBaseContainer = ({ sentenceSnippet, handleFlashCard }) => {
  return (
    <LearningContentDetail
      sentenceData={sentenceSnippet}
      handleFlashCard={handleFlashCard}
    />
  );
};

export default LearningBaseContainer;
