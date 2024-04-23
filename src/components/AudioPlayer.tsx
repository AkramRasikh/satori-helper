import { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({
  mp3AudioFile,
  setRefs,
  handleAudioEnd,
  handleAudioPlay,
  inArrayIndex,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef();

  const playAudio = () => {
    ref?.current.play();
  };

  const handleAudioError = (event) => {
    console.error('Audio error:', event.target.error);
  };
  useEffect(() => {
    if (ref?.current && !isLoaded) {
      setRefs(ref, inArrayIndex);
      setIsLoaded(true);
    }
  }, [ref, setRefs, isLoaded]);

  useEffect(() => {
    if (ref?.current) {
      ref?.current.addEventListener('play', handleAudioPlay);
      ref?.current.addEventListener('ended', handleAudioEnd);
      ref.current.addEventListener('error', handleAudioError);
      // setIsAttachedEvents(true);
    }
    console.log('## attached???');

    return () => {
      ref?.current.removeEventListener('ended', handleAudioEnd);
      ref?.current.removeEventListener('play', handleAudioPlay);
    };
  }, [ref]);

  return (
    <div>
      <audio controls ref={ref}>
        <source src={mp3AudioFile} type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
      <button onClick={playAudio}>playAudio</button>
    </div>
  );
};

export default AudioPlayer;
