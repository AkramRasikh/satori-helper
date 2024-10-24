import { makeArrayUnique } from '@/utils/makeArrayUnique';
import { useState } from 'react';

const useHighlightWordToWordBank = ({ pureWordsUnique, selection }) => {
  const [highlightedWord, setHighlightedWord] = useState('');
  const [highlightedWordSentenceId, setHighlightedWordSentenceId] = useState();
  const [savedWords, setSavedWords] = useState([]);

  const handleHighlight = (sentenceId) => {
    const highlightedText = selection.toString().trim();
    if (highlightedText !== '') {
      setHighlightedWord(highlightedText);
      setHighlightedWordSentenceId(sentenceId);
    }
  };

  const removeFromHighlightWordBank = () => {
    setHighlightedWord('');
    setHighlightedWordSentenceId(undefined);
  };

  const saveToWordBank = async () => {
    if (!highlightedWordSentenceId) {
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
      const response = await fetch(baseUrl + '/add-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: highlightedWord,
          context: highlightedWordSentenceId,
        }),
      });
      const res = await response.json();

      const wordAdded = res.word.surfaceForm;

      setSavedWords((prev) =>
        prev?.length === 0 ? [wordAdded] : [...prev, wordAdded],
      );
    } catch (error) {
      console.error('## saveToWordBank Error:', error);
    } finally {
      removeFromHighlightWordBank();
      setHighlightedWordSentenceId(undefined);
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
