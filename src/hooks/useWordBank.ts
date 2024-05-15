import { useState } from 'react';

const useWordBank = () => {
  const [wordBank, setWordBank] = useState([]);

  const handleAddToWordBank = (wordData) => {
    const isWordInWord = wordBank.find(
      (wordObj) => wordObj?.word === wordData.word,
    );

    if (!isWordInWord) {
      setWordBank((prev) => [
        ...prev,
        { word: wordData.word, context: wordData.context },
      ]);
    }
  };

  const handleRemoveFromBank = (wordToDelete) => {
    const filteredWordBank = wordBank.filter(
      (wordData) => wordData.word !== wordToDelete,
    );

    setWordBank(filteredWordBank);
  };

  const handleClearWordBank = () => {
    setWordBank([]);
  };

  return {
    handleAddToWordBank,
    handleRemoveFromBank,
    handleClearWordBank,
    wordBank,
  };
};

export default useWordBank;
