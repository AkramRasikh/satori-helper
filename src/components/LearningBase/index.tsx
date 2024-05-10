import React, { useState } from 'react';
import LearningBaseItemWrapper from './LearningBaseItemWrapper';
import SelectAllButtons from '../SelectAllButtons';

const LearningBase = ({
  sentenceList,
  handleAddToWordBank,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
  wordBank,
  handleFlashCard,
  numberOfWordsInWordBank,
  numberOfWordsToStudy,
  handleAllSentences,
  handleClearWordBank,
}) => {
  const [isOpenLearningBase, setIsOpenLearningBase] = useState(true);
  const handleOpenLearningBase = () => {
    setIsOpenLearningBase(!isOpenLearningBase);
  };
  const up = '▲';
  const down = '▼';
  return (
    <div
      style={{
        padding: '5px 15px',
      }}
    >
      <button
        style={{
          border: 'none',
          padding: '15px',
          borderRadius: '15%',
          cursor: 'pointer',
          marginRight: '10px',
        }}
        onClick={handleOpenLearningBase}
      >
        Learning Base {isOpenLearningBase ? down : up}
      </button>
      {isOpenLearningBase && (
        <SelectAllButtons
          numberOfWordsInWordBank={numberOfWordsInWordBank}
          numberOfWordsToStudy={numberOfWordsToStudy}
          handleAllSentences={handleAllSentences}
          handleClearWordBank={handleClearWordBank}
        />
      )}
      {isOpenLearningBase && (
        <ul
          style={{
            listStyleType: 'none',
            width: 'fit-content',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: '8px',
            padding: '5px 0',
            marginTop: '0px',
          }}
        >
          {sentenceList?.map((sentenceSnippet, index) => {
            return (
              <LearningBaseItemWrapper
                key={index}
                arrayIndex={index}
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
