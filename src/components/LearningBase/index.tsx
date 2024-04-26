import React, { useState } from 'react';
import LearningBaseItemWrapper from './LearningBaseItemWrapper';

const LearningBase = ({
  sentenceList,
  handleAddToWordBank,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
  wordBank,
  handleFlashCard,
}) => {
  const [isOpenLearningBase, setIsOpenLearningBase] = useState(true);
  const handleOpenLearningBase = () => {
    setIsOpenLearningBase(!isOpenLearningBase);
  };
  const up = '▲';
  const down = '▼';
  return (
    <div>
      <button
        style={{
          border: 'none',
          padding: '5px',
          borderRadius: '15%',
          cursor: 'pointer',
        }}
        onClick={handleOpenLearningBase}
      >
        Learning Base {isOpenLearningBase ? down : up}
      </button>
      {isOpenLearningBase && (
        <ul
          style={{
            listStyleType: 'none',
            width: 'fit-content',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: '8px',
            padding: '15px',
            marginTop: '0px',
          }}
        >
          {sentenceList?.map((sentenceSnippet, index) => {
            return (
              <LearningBaseItemWrapper
                key={index}
                sentenceSnippet={sentenceSnippet}
                handleAddToWordBank={handleAddToWordBank}
                wordBankForGeneratedWords={wordBankForGeneratedWords}
                deleteWordFromSentenceList={deleteWordFromSentenceList}
                wordBank={wordBank}
                handleFlashCard={handleFlashCard}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LearningBase;
