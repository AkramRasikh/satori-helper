import React, { useState } from 'react';
import NestedStatus from './NestedStatus';

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
    <div style={{ borderBottom: '5px solid grey' }}>
      <ul
        style={{
          marginLeft: '30%',
          listStyleType: 'none',
        }}
      >
        {sentenceList?.map((sentenceSnippet, index) => {
          const textWithKanji = sentenceSnippet[1];
          return (
            <li key={index} style={{ padding: '5px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  maxWidth: '300px',
                }}
              >
                <span style={{ marginRight: '5px' }}>{textWithKanji}</span>
                <button onClick={() => scrollToFullCard(index)}>more</button>
                <NestedStatus />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TopSection;
