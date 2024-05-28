import AudioPlayerElement from '@/components/AudioPlayer/AudioPlayerElement';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useRef, useState } from 'react';

const OneContext = ({ context, japaneseWord, isOriginal, arrIndex }) => {
  const audioRef = useRef();
  const underlineWordsInSentence = (sentence, thisWordBank) => {
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
              : arrIndex + ') ' + underlinedSentence,
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        {underlineWordsInSentence(context.targetLang, [
          japaneseWord.baseForm,
          japaneseWord.surfaceForm,
        ])}
        <p style={{ margin: '5px 0' }}>{context.baseLang}</p>
        {context.notes && (
          <p style={{ margin: '5px 0' }}>notes: {context.notes}</p>
        )}
      </div>
      {context.hasAudio && (
        <AudioPlayerElement
          ref={audioRef}
          url={getFirebaseAudioURL(context.id)}
        />
      )}
    </div>
  );
};

const JapaneseWordItem = ({
  japaneseWord,
  handleAddToWordBank,
  getWordsContext,
}) => {
  const [showMoreContexts, setShowMoreContexts] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(true);
  const baseForm = japaneseWord?.baseForm;
  const definition = japaneseWord?.definition;
  const phonetic = japaneseWord?.phonetic;
  const transliteration = japaneseWord?.transliteration;
  const contexts = japaneseWord?.contexts;

  if (!japaneseWord) {
    return <span>...loading!</span>;
  }
  const originalContext = contexts[0];

  const hasMoreContexts = contexts?.length > 1;

  return (
    <li key={japaneseWord.id} style={{ listStyleType: 'none' }}>
      <div style={{ display: 'flex', background: 'antiquewhite' }}>
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
              context: getWordsContext(originalContext.id),
            })
          }
        >
          Add to wordbank
        </button>
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
          onClick={() => setShowMoreInfo(!showMoreInfo)}
        >
          More
        </button>
      </div>
      {showMoreInfo && (
        <div style={{ border: '1px solid gray' }}>
          {hasMoreContexts ? (
            <button
              onClick={() => setShowMoreContexts(!showMoreContexts)}
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
            >
              Show more context
            </button>
          ) : null}
          <OneContext
            japaneseWord={japaneseWord}
            context={originalContext}
            isOriginal
            arrIndex={0}
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
                  arrIndex={index}
                />
              );
            })}
        </div>
      )}
    </li>
  );
};

export default JapaneseWordItem;
