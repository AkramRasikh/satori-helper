import WordDetail from './WordDetail';

const ExtraInfoList = ({ response, sentenceList }) => {
  return (
    <>
      <div>
        <ul>
          {response &&
            response.split('\n').map((detail, index) => {
              return (
                <li key={index}>
                  <p>{detail}</p>
                </li>
              );
            })}
        </ul>
      </div>
      <ul style={{ listStyleType: 'none', padding: '5px' }}>
        {sentenceList?.map((sentenceData, index) => (
          <WordDetail key={index} sentenceData={sentenceData} />
        ))}
      </ul>
    </>
  );
};

export default ExtraInfoList;
