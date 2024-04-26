import WordBankItem from './WordBankItem';

const WordBankSection = ({ wordBankRef, wordBank, handleRemoveFromBank }) => {
  if (!wordBank?.length) {
    return null;
  }

  return (
    <div>
      <ol ref={wordBankRef}>
        {wordBank.map((word, index) => {
          return (
            <WordBankItem
              word={word}
              handleRemoveFromBank={handleRemoveFromBank}
              key={index}
            />
          );
        })}
      </ol>
    </div>
  );
};

export default WordBankSection;
