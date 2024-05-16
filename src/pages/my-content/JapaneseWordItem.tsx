import AudioPlayerElement from '@/components/AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useState } from 'react';

const JapaneseWordItem = ({
  japaneseWord,
  handleAddToWordBank,
  getWordsContext,
}) => {
  const [showMoreContexts, setShowMoreContexts] = useState(false);
  const baseForm = japaneseWord.baseForm;
  const definition = japaneseWord.definition;
  const phonetic = japaneseWord.phonetic;
  const transliteration = japaneseWord.transliteration;
  const contexts = japaneseWord.contexts;
  const originalContext = contexts[0];

  const hasMoreContexts = contexts?.length > 1;

  const underlineWordsInSentence = (sentence, thisWordBank) => {
    console.log('## underlineWordsInSentence: ', {
      sentence,
      thisWordBank,
    });

    if (sentence) {
      const pattern = new RegExp(thisWordBank.join('|'), 'g');
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
          }}
        />
      );
    }
    return <p>{sentence}</p>;
  };
  return (
    <li key={japaneseWord.id}>
      <div style={{ display: 'flex' }}>
        <p>
          {baseForm} --- <span>{definition}</span> --- <span>{phonetic}</span>{' '}
          ---- <span>{transliteration}</span>
        </p>
        <button
          style={{
            margin: 'auto 0',
            marginLeft: '5px',
            height: 'fit-content',
            padding: '10px',
            borderRadius: '15px',
            border: 'none',
            cursor: 'pointer',
            display: 'block',
          }}
          onClick={() =>
            handleAddToWordBank({
              word: baseForm,
              context: getWordsContext(originalContext),
            })
          }
        >
          Add to wordbank
        </button>
      </div>
      <div style={{ border: '1px solid gray' }}>
        <div style={{ display: 'flex' }}>
          <p>Orignal Context</p>{' '}
          {hasMoreContexts ? (
            <button onClick={() => setShowMoreContexts(!showMoreContexts)}>
              Show more context
            </button>
          ) : null}
        </div>
        {underlineWordsInSentence(originalContext.targetLang, [
          japaneseWord.baseForm,
          japaneseWord.surfaceForm,
        ])}
        <p>baseLang: {originalContext.baseLang}</p>
        {originalContext.notes && <p>notes: {originalContext.notes}</p>}
        {originalContext.hasAudio && (
          <AudioPlayerElement url={getFirebaseAudioURL(originalContext.id)} />
        )}
      </div>
    </li>
  );
};

export default JapaneseWordItem;
