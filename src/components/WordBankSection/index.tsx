const WordBankSection = ({ wordBankRef, wordBank, handleRemoveFromBank }) => (
  <div>
    <ol ref={wordBankRef}>
      {wordBank.map((word, index) => {
        return (
          <li key={index}>
            <button
              onClick={() => handleRemoveFromBank(word.word)}
              style={{
                border: 'grey',
                fontSize: '15px',
                borderRadius: '15%',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              <span>❌</span>
            </button>
            <span>
              {word.word} context: {word.context}
            </span>
          </li>
        );
      })}
    </ol>
  </div>
);

export default WordBankSection;
