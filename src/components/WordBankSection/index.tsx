import WordBankItem from './WordBankItem';

const WordBankSection = ({ wordBank, handleRemoveFromBank }) => {
  if (!wordBank?.length) {
    return null;
  }

  return (
    <div>
      <ol>
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
