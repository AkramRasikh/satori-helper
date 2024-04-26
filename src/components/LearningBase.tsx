import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import WordDetail from './WordDetail';

const WordDetailWrapper = ({
  handleAddToWordBank,
  sentenceSnippet,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
  handleFlashCard,
  wordBank,
}) => {
  const [isRemoved, setIsRemoved] = useState(false);

  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const textWithKanji = sentenceSnippet[1];
  const wordHasBeenUsed = wordBankForGeneratedWords.includes(textWithKanji);

  const isInWordBank = wordBank.some(
    (wordObj) => wordObj.word === textWithKanji,
  );

  const isInWordBankAndUsed = wordHasBeenUsed && isInWordBank;

  const handleDelete = () => {
    setIsRemoved(true);
  };

  return (
    <CSSTransition
      in={!isRemoved}
      timeout={500}
      classNames='fade'
      unmountOnExit
      onExited={() => {
        deleteWordFromSentenceList(textWithKanji);
      }}
    >
      <li
        style={{
          padding: '10px',
          border: isInWordBankAndUsed
            ? '3px dashed lightgreen'
            : wordHasBeenUsed
            ? '3px solid lightgreen'
            : isInWordBank
            ? '3px solid orange'
            : '3px solid red',
          display: 'flex',
          flexWrap: 'wrap',
          borderRadius: '20px',
          width: isMoreInfoOpen ? '100%' : 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          <button
            style={{
              border: 'grey',
              fontSize: '15px',
              borderRadius: '15%',
              cursor: 'pointer',
              height: 'fit-content',
            }}
            onClick={() =>
              handleAddToWordBank({
                word: sentenceSnippet[1],
                context: sentenceSnippet[0],
                definition: sentenceSnippet[4],
              })
            }
          >
            🧺
          </button>
          <span style={{ margin: '0 10px' }}>{textWithKanji}</span>
        </div>
        <WordDetailContainer
          sentenceSnippet={sentenceSnippet}
          isMoreInfoOpen={isMoreInfoOpen}
          setIsMoreInfoOpen={setIsMoreInfoOpen}
          handleFlashCard={handleFlashCard}
        />
        <button
          onClick={handleDelete}
          style={{
            border: 'none',
            borderRadius: '15%',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          ❌
        </button>
      </li>
    </CSSTransition>
  );
};

const WordDetailContainer = ({
  sentenceSnippet,
  isMoreInfoOpen,
  setIsMoreInfoOpen,
  handleFlashCard,
}) => {
  const handleMoreInfo = () => {
    setIsMoreInfoOpen(!isMoreInfoOpen);
  };

  const text = isMoreInfoOpen ? 'Collapse' : 'More info';

  return (
    <div>
      <button
        onClick={handleMoreInfo}
        style={{
          border: 'none',
          padding: '5px',
          borderRadius: '15%',
          cursor: 'pointer',
        }}
      >
        {text}
      </button>
      {isMoreInfoOpen && (
        <WordDetail
          sentenceData={sentenceSnippet}
          handleFlashCard={handleFlashCard}
        />
      )}
    </div>
  );
};

const LearningBase = ({
  sentenceList,
  handleAddToWordBank,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
  wordBank,
  handleFlashCard,
}) => {
  return (
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
              <WordDetailWrapper
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
};

export default LearningBase;