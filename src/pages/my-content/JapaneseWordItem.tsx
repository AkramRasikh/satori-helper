import AudioPlayerElement from '@/components/AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useState } from 'react';

const OneContext = ({ context, japaneseWord, isOriginal }) => {
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
            __html: isOriginal
              ? `Original Context: ${underlinedSentence}`
              : underlinedSentence,
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
    <div>
      {underlineWordsInSentence(context.targetLang, [
        japaneseWord.baseForm,
        japaneseWord.surfaceForm,
      ])}
      <p>baseLang: {context.baseLang}</p>
      {context.notes && <p>notes: {context.notes}</p>}
      {context.hasAudio && (
        <AudioPlayerElement url={getFirebaseAudioURL(context.id)} />
      )}
    </div>
  );
};

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
        {hasMoreContexts ? (
          <button onClick={() => setShowMoreContexts(!showMoreContexts)}>
            Show more context
          </button>
        ) : null}
        <OneContext
          japaneseWord={japaneseWord}
          context={originalContext}
          isOriginal
        />
        {showMoreContexts &&
          contexts?.map((context, index) => {
            if (index === 0) return null;
            return (
              <OneContext
                key={context.id}
                japaneseWord={japaneseWord}
                context={context}
                isOriginal={false}
              />
            );
          })}
      </div>
    </li>
  );
};

export default JapaneseWordItem;
