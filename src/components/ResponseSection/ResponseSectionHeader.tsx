const ResponseSectionHeader = ({
  index,
  wordBank,
  isContentOpen,
  setIsContentOpen,
}) => {
  const up = '▲';
  const down = '▼';
  return (
    <div
      style={{
        outline: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <h3 style={{ textAlign: 'center' }}>
        {index + 1}
        {'.    '}
        Words in this response:{' '}
        {wordBank.map((word, indexWord) => (
          <span key={indexWord}>
            {word}
            {indexWord === wordBank.length - 1 ? '' : ', '}
          </span>
        ))}
      </h3>
      <button
        onClick={() => setIsContentOpen(!isContentOpen)}
        style={{
          border: 'none',
          padding: '5px',
          borderRadius: '15%',
          cursor: 'pointer',
          marginRight: '10px',
        }}
      >
        {!isContentOpen ? up : down}
      </button>
    </div>
  );
};

export default ResponseSectionHeader;
