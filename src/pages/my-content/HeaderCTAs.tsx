const HeaderCTAs = ({
  setShowTextArea,
  showTextArea,
  handleLoadWords,
  handleLoadWordsViaTopic,
  handleLoadWordsSelectedTopicsWords,
}) => {
  return (
    <div>
      <button
        onClick={() => setShowTextArea(!showTextArea)}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Content text
      </button>
      <button
        onClick={handleLoadWords}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '5px',
        }}
      >
        Load Words
      </button>
      <button
        onClick={handleLoadWordsViaTopic}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '5px',
        }}
      >
        Load Words via topics
      </button>
      <button
        onClick={handleLoadWordsSelectedTopicsWords}
        style={{
          height: 'fit-content',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '5px',
        }}
      >
        Load selected topics words
      </button>
    </div>
  );
};

export default HeaderCTAs;
