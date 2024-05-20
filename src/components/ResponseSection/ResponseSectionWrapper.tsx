import { useState } from 'react';
import ResponseSectionHeader from './ResponseSectionHeader';
import ResponseSectionItem from './ResponseSectionItem';

const ResponseSectionWrapper = ({
  wordBank,
  response,
  handleDeleteSentence,
  mp3Bank,
  saveContentToFirebaseSatori,
  index,
  getNarakeetAudioFunc,
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
          saveContentToFirebaseSatori={saveContentToFirebaseSatori}
          getNarakeetAudioFunc={getNarakeetAudioFunc}
        />
      )}
    </div>
  );
};

export default ResponseSectionWrapper;
