const HeaderCTAs = ({ setShowTextArea, showTextArea, handleLoadWords }) => {
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
    </div>
  );
};

export default HeaderCTAs;
