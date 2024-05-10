import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import AudioPlayerElement from './AudioPlayer/AudioPlayerElement';

const ContextHelpers = ({ contextHelperData }) => {
  return (
    <div>
      <h2>Context Helper Data:</h2>
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
    </div>
  );
};

export default ContextHelpers;
