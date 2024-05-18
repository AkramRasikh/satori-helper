const SatoriHighlightReviewActions = ({
  removeFromHighlightWordBank,
  highlightedWord,
  saveToWordBank,
}) => {
  return (
    <p>
      Send Word to DB:{' '}
      <span
        style={{
          margin: '5px',
        }}
      >
        <button
          style={{
            border: 'none',
            borderRadius: '5px',
            padding: '5px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
          onClick={removeFromHighlightWordBank}
        >
          Remove word ❌
        </button>
        <span>{highlightedWord}</span>
        <button
          style={{
            border: 'none',
            borderRadius: '5px',
            padding: '5px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
          onClick={saveToWordBank}
        >
          Add word 🤙🏽
        </button>
      </span>
    </p>
  );
};

export default SatoriHighlightReviewActions;
