const WordDetail = ({ sentenceData, handleFlashCard }) => {
  const sentence = sentenceData[0];
  const textWithKanji = sentenceData[1];
  const textZeroKanji = sentenceData[2];
  const audioUrl = sentenceData[3];
  const definition = sentenceData[4];
  const engTranslation = sentenceData[5];
  const cardId = sentenceData[6];

  const handleFlashCardFunc = (flashCardNumber) => {
    handleFlashCard(flashCardNumber, cardId);
  };

  const formattedSentence = sentence.replace(
    new RegExp(textWithKanji, 'g'),
    `<span style="font-weight: bold; text-decoration: underline;">${textWithKanji}</span>`,
  );

  return (
    <li>
      <div>
        <p dangerouslySetInnerHTML={{ __html: formattedSentence }} />
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          {textWithKanji}
        </span>
        <br />
        {textWithKanji !== textZeroKanji && (
          <>
            <span>{textZeroKanji}</span>
            <br />
          </>
        )}
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          Eng: {definition}
        </span>
      </div>
      <div>
        <span>
          <i> Eng: {engTranslation}</i>
        </span>
      </div>
      <div>
        <audio controls>
          <source src={audioUrl} type='audio/mpeg' />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div
        style={{
          marginTop: '10px',
        }}
      >
        <button
          style={{
            border: 'none',
            borderRadius: '15px',
            padding: '10px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
          title='No point, just make a bloodclart sentence!'
          disabled
        >
          Incorrect
        </button>
        <button
          style={{
            border: 'none',
            borderRadius: '15px',
            padding: '10px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
          onClick={() => handleFlashCardFunc(3)}
        >
          Hard
        </button>
        <button
          style={{
            border: 'none',
            borderRadius: '15px',
            padding: '10px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
          onClick={() => handleFlashCardFunc(4)}
        >
          Medium
        </button>
        <button
          style={{
            border: 'none',
            borderRadius: '15px',
            padding: '10px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
          onClick={() => handleFlashCardFunc(5)}
        >
          Easy
        </button>
      </div>
    </li>
  );
};

export default WordDetail;
