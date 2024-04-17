import React, { useState } from 'react';

import WordDetail from './WordDetail';

const WordDetailContainer = ({ sentenceSnippet }) => {
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);

  const handleMoreInfo = () => {
    setIsMoreInfoOpen(!isMoreInfoOpen);
  };

  return (
    <div>
      <button onClick={handleMoreInfo}>Click for Info</button>
      {isMoreInfoOpen && <WordDetail sentenceData={sentenceSnippet} />}
    </div>
  );
};

const TopSection = ({ sentenceList, listRefs, handleAddToWordBank }) => {
  const scrollToFullCard = (indexPassed) => {
    if (listRefs?.current?.length > 0) {
      listRefs.current[indexPassed].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div
      style={{
        borderBottom: '5px solid grey',
        width: 'fit-content',
      }}
    >
      <ul
        style={{
          listStyleType: 'none',
          width: 'fit-content',
        }}
      >
        {sentenceList?.map((sentenceSnippet, index) => {
          const textWithKanji = sentenceSnippet[1];
          return (
            <li
              key={index}
              style={{ padding: '10px', borderBottom: '1px solid grey' }}
            >
              <div
                style={{
                  display: 'flex',
                }}
              >
                <button
                  style={{ border: 'none', background: 'none' }}
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
