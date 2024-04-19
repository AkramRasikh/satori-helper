import { useState } from 'react';

const MoreNestedResponse = ({ detail }) => {
  const [audioUrl, setAudioUrl] = useState('');
  let japaneseBareText = '';
  const japaneseRegex = /\[JP\]/;

  const isJapaneseText = japaneseRegex.test(detail);

  const handleGetAudio = async () => {
    if (!japaneseBareText) return null;
    try {
      // figure reference to code
      await fetch('/api/chatgpt-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tts: japaneseBareText }),
      });
      setAudioUrl('/audio/' + japaneseBareText + '.mp3');
    } catch (error) {
      console.error('## Error fetching data:', error);
    }
  };
  if (isJapaneseText) {
    japaneseBareText = detail.replace(japaneseRegex, '');
  }

  if (!detail) {
    return null;
  }
  return (
    <li>
      <p>{detail}</p>
      {isJapaneseText && <button onClick={handleGetAudio}>Get Audio</button>}
      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </li>
  );
};

const ResponseItem = ({ responseItem }) => {
  return (
    <div style={{ borderTop: '1px solid grey' }}>
      {responseItem.split('\n').map((detail, index) => {
        return <MoreNestedResponse key={index} detail={detail} />;
      })}
    </div>
  );
};
const ResponseSection = ({ response }) => {
  return (
    <ul style={{ borderBottom: '1px solid grey' }}>
      {response.map((responseItem, index) => (
        <ResponseItem key={index} responseItem={responseItem} />
      ))}
    </ul>
  );
};

export default ResponseSection;
