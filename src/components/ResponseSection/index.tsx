import ResponseSectionWrapper from './ResponseSectionWrapper';

const ResponseSection = ({ response, handleDeleteSentence, mp3Bank }) => {
  let totalSentenceCount = 0;

  const renderedResponse = response.map((responseItem, index) => {
    const sentenceCount = responseItem.response.length;

    totalSentenceCount += sentenceCount;

    const wordBank = responseItem.wordBank;
    const response = responseItem.response;

    return (
      <ResponseSectionWrapper
        key={index}
        index={index}
        wordBank={wordBank}
        response={response}
        handleDeleteSentence={handleDeleteSentence}
        mp3Bank={mp3Bank}
      />
    );
  });

  return (
    <div>
      <h3 style={{ margin: 'auto', textAlign: 'center' }}>
        Total sentence count: {totalSentenceCount}
      </h3>
      <ul
        style={{
          borderBottom: '1px solid grey',
          padding: '10px',
          listStyleType: 'none',
        }}
      >
        {renderedResponse}
      </ul>
    </div>
  );
};

export default ResponseSection;
