import { useState } from 'react';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';

const ContextHelpers = ({ contextHelperData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const up = '▲';
  const down = '▼';

  return (
    <div>
      <div
        style={{
          borderRadius: '15px',
          padding: '15px',
          display: 'flex',
        }}
      >
        <button
          style={{
            margin: 'auto 0',
            marginRight: '5px',
            height: 'fit-content',
            padding: '15px',
            borderRadius: '15px',
            border: 'none',
            cursor: 'pointer',
            display: 'block',
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          Context Helper Data {isOpen ? down : up}
        </button>
      </div>
      {isOpen && (
        <ul>
          {contextHelperData?.map((item) => {
            const {
              baseLang,
              id,
              matchedWords,
              moodUsed,
              underlinedText,
              hasAudio,
            } = item;
            return (
              <li key={id}>
                <div>
                  <h4>Matched Words: {matchedWords.join(',  ')}</h4>
                  <p
                    dangerouslySetInnerHTML={{ __html: underlinedText }}
                    style={{
                      margin: '5px 0',
                    }}
                  />
                  <p>Eng: {baseLang}</p>
                  <p>Mood: {moodUsed}</p>
                  {hasAudio && (
                    <AudioPlayerElement url={getFirebaseAudioURL(id)} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContextHelpers;
