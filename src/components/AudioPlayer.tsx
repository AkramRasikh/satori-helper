import { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({ mp3AudioFile, setRefs }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (ref?.current && !isLoaded) {
      setRefs(ref);
      setIsLoaded(true);
    }
  }, [ref, setRefs, isLoaded]);

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
