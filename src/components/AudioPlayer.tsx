import { useRef } from 'react';

const AudioPlayer = ({ mp3AudioFile }) => {
  const ref = useRef();

  return (
    <div>
      <audio controls ref={ref}>
        <source src={mp3AudioFile} type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
