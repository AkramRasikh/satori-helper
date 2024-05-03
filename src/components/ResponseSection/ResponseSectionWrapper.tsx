import { useState } from 'react';
import ResponseSectionHeader from './ResponseSectionHeader';
import ResponseSectionItem from './ResponseSectionItem';

const ResponseSectionWrapper = ({
  wordBank,
  response,
  handleDeleteSentence,
  mp3Bank,
  index,
}) => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid grey' }}>
      <ResponseSectionHeader
        index={index}
        wordBank={wordBank}
        isContentOpen={isContentOpen}
        setIsContentOpen={setIsContentOpen}
      />
      {isContentOpen && (
        <ResponseSectionItem
          responseItem={response}
          wordBank={wordBank}
          handleDeleteSentence={handleDeleteSentence}
          mp3Bank={mp3Bank}
        />
      )}
    </div>
  );
};

export default ResponseSectionWrapper;
