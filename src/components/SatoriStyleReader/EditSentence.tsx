import { useState } from 'react';

const EditSentence = ({
  sentenceToEdit,
  setEditSentence,
  topic,
  handleUpdateContentSentence,
  fetchDurationsAgainCB,
}) => {
  const targetLang = sentenceToEdit.targetLang;
  const [inputText, setInputText] = useState(targetLang);
  const areSentencesTheSame = targetLang === inputText.trim();

  const handleUpdateSentence = () => {
    if (areSentencesTheSame) return;
    handleUpdateContentSentence({
      sentenceId: sentenceToEdit.id,
      topicName: topic,
      fieldToUpdate: {
        targetLang: inputText,
      },
      withAudio: true,
      fetchDurationsAgainCB,
    });
    setEditSentence('');
  };

  return (
    <div>
      <p>Edit sentence</p>
      <div>
        <p>Orginal: {targetLang}</p>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            width: '100%',
          }}
        />
      </div>
      <div>
        <button onClick={() => setEditSentence('')}>❌</button>
        <button onClick={handleUpdateSentence} disabled={areSentencesTheSame}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditSentence;
