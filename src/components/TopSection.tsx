import React, { useState } from 'react';

import WordDetail from './WordDetail';

const WordDetailContainer = ({ sentenceSnippet }) => {
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);

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
          marginTop: isMoreInfoOpen ? '10px' : 'auto',
        }}
      >
        {text}
      </button>
      {isMoreInfoOpen && <WordDetail sentenceData={sentenceSnippet} />}
    </div>
  );
};

const TopSection = ({ sentenceList, handleAddToWordBank }) => {
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
        }}
      >
        {sentenceList?.map((sentenceSnippet, index) => {
          const textWithKanji = sentenceSnippet[1];
          return (
            <li
              key={index}
              style={{
                padding: '10px',
                border: '1px solid grey',
                display: 'flex',
                flexWrap: 'wrap' /* Allow items to wrap within the list */,
                borderRadius: '20px',
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
              <WordDetailContainer sentenceSnippet={sentenceSnippet} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopSection;
