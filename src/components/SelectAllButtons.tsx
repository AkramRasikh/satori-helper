const SelectAllButtons = ({
  numberOfWordsInWordBank,
  handleAllSentences,
  handleClearWordBank,
  numberOfWordsToStudy,
}) => {
  return numberOfWordsInWordBank < numberOfWordsToStudy ? (
    <button
      style={{
        margin: 'auto auto auto 10px',
        height: 'fit-content',
        padding: '15px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={handleAllSentences}
    >
      Select all words
    </button>
  ) : numberOfWordsInWordBank === numberOfWordsToStudy ? (
    <button
      style={{
        margin: 'auto auto auto 10px',
        height: 'fit-content',
        padding: '15px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={handleClearWordBank}
    >
      Unselect all words
    </button>
  ) : null;
};

export default SelectAllButtons;
