import React, { useState } from 'react';

import WordDetail from './WordDetail';

const WordDetailWrapper = ({
  handleAddToWordBank,
  sentenceSnippet,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
}) => {
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const textWithKanji = sentenceSnippet[1];
  const wordHasBeenUsed = wordBankForGeneratedWords.includes(textWithKanji);
  const handleDelete = () => {
    deleteWordFromSentenceList(textWithKanji);
  };
  return (
    <li
      style={{
        padding: '10px',
        border: wordHasBeenUsed ? '3px solid lightgreen' : '1px solid grey',
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
      />
      <button
        onClick={handleDelete}
        style={{
          border: 'none',
          borderRadius: '15%',
          marginLeft: '10px',
          cursor: 'pointer',
        }}
      >
        ❌
      </button>
    </li>
  );
};

const WordDetailContainer = ({
  sentenceSnippet,
  isMoreInfoOpen,
  setIsMoreInfoOpen,
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
      {isMoreInfoOpen && <WordDetail sentenceData={sentenceSnippet} />}
    </div>
  );
};

const TopSection = ({
  sentenceList,
  handleAddToWordBank,
  wordBankForGeneratedWords,
  deleteWordFromSentenceList,
}) => {
  return (
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
            />
          );
        })}
      </ul>
    </div>
  );
};

export default TopSection;
