import { CSSTransition } from 'react-transition-group';
import { useState } from 'react';
import LearningBaseContainer from './LearningBaseContainer';

const LearningBaseItemWrapper = ({
  handleAddToWordBank,
  sentenceSnippet,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
  handleFlashCard,
  wordBank,
}) => {
  const [isRemoved, setIsRemoved] = useState(false);

  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const textWithKanji = sentenceSnippet.textWithKanji;
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
                word: sentenceSnippet.textZeroKanji,
                context: sentenceSnippet.fullSentence,
                definition: sentenceSnippet.definition,
              })
            }
          >
            🧺
          </button>
          <span style={{ margin: '0 10px' }}>{textWithKanji}</span>
        </div>
        <div
          id='meow'
          style={{
            display: 'flex',
            justifyContent: isMoreInfoOpen ? 'space-between' : '',
          }}
        >
          <LearningBaseContainer
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
              height: isMoreInfoOpen ? 'fit-content' : 'auto',
            }}
          >
            ❌
          </button>
        </div>
      </li>
    </CSSTransition>
  );
};

export default LearningBaseItemWrapper;
