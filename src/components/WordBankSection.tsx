const WordBankSection = ({
  wordBankRef,
  wordBank,
  handleRemoveFromBank,
  handleClearWordBank,
}) => {
  return (
    <div>
      <ul ref={wordBankRef}>
        {wordBank.map((word, index) => {
          return (
            <li key={index}>
              <button onClick={() => handleRemoveFromBank(word.word)}>
                <span>❌</span>
              </button>
              <span>
                {word.word} context: {word.context}
              </span>
            </li>
          );
        })}
      </ul>
      <button onClick={handleClearWordBank}>Clear word bank 🏦!</button>
    </div>
  );
};

export default WordBankSection;
