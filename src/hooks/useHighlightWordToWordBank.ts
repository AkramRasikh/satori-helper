import { makeArrayUnique } from '@/utils/makeArrayUnique';
import { useState } from 'react';

const useHighlightWordToWordBank = (content, pureWordsUnique, selection) => {
  const [highlightedWord, setHighlightedWord] = useState('');
  const [savedWords, setSavedWords] = useState([]);

  const handleHighlight = () => {
    const highlightedText = selection.toString().trim();
    if (highlightedText !== '') {
      setHighlightedWord(highlightedText);
    }
  };

  const removeFromHighlightWordBank = () => {
    setHighlightedWord('');
  };

  const saveToWordBank = async () => {
    const contextId = content.id;

    try {
      const response = await fetch('http://localhost:3001/add-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: highlightedWord,
          contexts: [contextId],
        }),
      });
      const res = await response.json();

      const wordAdded = res.word;

      setSavedWords((prev) =>
        prev?.length === 0 ? [wordAdded] : [...prev, wordAdded],
      );
    } catch (error) {
      console.error('## saveToWordBank Error:', error);
    } finally {
      removeFromHighlightWordBank();
    }
  };

  const underlineWordsInSentence = (sentence, isInHighlightMode) => {
    const masterBank = makeArrayUnique([
      ...savedWords,
      ...(pureWordsUnique || []),
      ...(isInHighlightMode ? [highlightedWord] : []),
    ]);
    if (masterBank?.length === 0) return sentence;

    const pattern = new RegExp(masterBank.join('|'), 'g');

    const underlinedSentence = sentence?.replace(pattern, (match) => {
      if (match === highlightedWord && isInHighlightMode) {
        return `<span style="color:goldenrod">${match}</span>`;
      }

      return `<u>${match}</u>`;
    });

    return underlinedSentence;
  };

  return {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  };
};
export default useHighlightWordToWordBank;
