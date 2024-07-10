import { useState } from 'react';

const FlashCardContainer = ({ item }) => {
  const [showMore, setShowMore] = useState(false);
  const baseForm = item.baseForm;
  const definition = item.definition;
  const phonetic = item.phonetic;
  const surfaceForm = item.surfaceForm;
  const transliteration = item.transliteration;
  const [firstContextToData] = item.contextToData;

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <p>{baseForm}</p>
        <button
          style={{ margin: 'auto 5px' }}
          onClick={() => setShowMore(!showMore)}
        >
          Show more
        </button>
      </div>
      {showMore ? (
        <div>
          <p>definition: {definition}</p>
          <p>phonetic: {phonetic}</p>
          <p>surfaceForm: {surfaceForm}</p>
          <p>transliteration: {transliteration}</p>
          <p>eg: {firstContextToData.targetLang}</p>
        </div>
      ) : null}
    </div>
  );
};

export default FlashCardContainer;
