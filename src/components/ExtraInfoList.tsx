import WordDetail from './WordDetail';

const ExtraInfoList = ({ response, sentenceList }) => {
  return (
    <>
      <div>
        <div>
          {response &&
            response.split('\n').map((detail, index) => {
              return <p key={index}>{detail}</p>;
            })}
        </div>
      </div>
      <div style={{ listStyleType: 'none', padding: '5px' }}>
        {sentenceList?.map((sentenceData, index) => (
          <WordDetail key={index} sentenceData={sentenceData} />
        ))}
      </div>
    </>
  );
};

export default ExtraInfoList;
