import LearningContentDetail from './LearningContentDetail';

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
          <LearningContentDetail key={index} sentenceData={sentenceData} />
        ))}
      </div>
    </>
  );
};

export default ExtraInfoList;
