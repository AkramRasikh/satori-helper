import React from 'react';
import LearningBaseItemWrapper from './LearningBaseItemWrapper';

const LearningBase = ({
  sentenceList,
  handleAddToWordBank,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
  wordBank,
  handleFlashCard,
}) => (
  <details open>
    <summary>Learning Base</summary>
    <div
      style={{
        borderBottom: '5px solid grey',
      }}
    >
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
    </div>
  </details>
);

export default LearningBase;
