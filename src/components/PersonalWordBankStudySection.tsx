import loadInPersonalStudyContent from '@/pages/api/load-content';
import { useState } from 'react';

const PersonalWordBankStudySection = () => {
  const [loadedData, setLoadedData] = useState([]);
  const handleLoadPersonalStudyWords = async () => {
    try {
      const res = await loadInPersonalStudyContent();
      console.log('## handleLoadPersonalStudyWords res: ', res);
      setLoadedData(res);
    } catch (error) {
      console.log('## handleLoadPersonalStudyWords erro: ', error);
    }
  };

  const underlineWordsInSentence = (sentence, thisWordBank) => {
    if (sentence) {
      const pattern = new RegExp(thisWordBank, 'g');
      const underlinedSentence = sentence?.replace(
        pattern,
        (match) => `<u>${match}</u>`,
      );
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: `Original Context: ${underlinedSentence}`,
          }}
          style={{
            margin: '5px 0',
            // background: isNowPlaying === inArrayIndex ? 'yellow' : 'none',
          }}
        />
      );
    }
    return <p>{sentence}</p>;
  };

  return (
    <div>
      <h3>Study section</h3>
      <button onClick={handleLoadPersonalStudyWords}>Load in words</button>
      <ul>
        {loadedData?.map((item, index) => {
          const contextData = item.contextData; // [{}]
          const timesReviewed = item.daysReviewed?.length; // [{}]
          return (
            <li key={index}>
              <div>
                <p>Word: {item.word}</p>
                <p>Number Of times reviewed: {timesReviewed}</p>
                {contextData.map((contextData) => {
                  return (
                    <div
                      style={{ borderBottom: '1px solid gray' }}
                      key={contextData.id}
                    >
                      {underlineWordsInSentence(
                        contextData.targetLang,
                        item.word,
                      )}
                      <p>base lang context: {contextData.baseLang}</p>
                      {contextData.notes && <p>Notes: {contextData.notes}</p>}
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PersonalWordBankStudySection;
