import React from 'react';

const TopSection = ({ sentenceList, listRefs }) => {
  const scrollToFullCard = (indexPassed) => {
    if (listRefs?.current?.length > 0) {
      listRefs.current[indexPassed].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  return (
    <div>
      <ul
        style={{
          borderBottom: '5px solid grey',
          textAlign: 'center',
          listStyleType: 'none',
        }}
      >
        {sentenceList?.map((sentenceSnippet, index) => {
          const textWithKanji = sentenceSnippet[1];
          return (
            <li key={index} style={{ padding: '5px' }}>
              <span style={{ marginRight: '5px' }}>{textWithKanji}</span>
              <button onClick={() => scrollToFullCard(index)}>more</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopSection;
