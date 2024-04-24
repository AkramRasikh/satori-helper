import { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({
  mp3AudioFile,
  setRefs,
  inArrayIndex,
  handleWhatAudioIsPlaying,
  handleWhatAudioIsEnded,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef();

  const handleAudioError = (event) => {
    console.error('## Audio error:', event.target.error);
  };
  useEffect(() => {
    if (ref?.current && !isLoaded) {
      setRefs(ref, inArrayIndex);
      setIsLoaded(true);
    }
  }, [ref, setRefs, inArrayIndex, isLoaded]);

  const audioPlay = () => {
    handleWhatAudioIsPlaying(inArrayIndex);
  };

  const audioEnded = () => {
    console.log('## AudioPlayer audioEnded: ', inArrayIndex);
    return handleWhatAudioIsEnded(inArrayIndex);
  };

  useEffect(() => {
    if (ref?.current) {
      ref.current.addEventListener('play', audioPlay);
      ref.current.addEventListener('ended', audioEnded);
      ref.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (ref?.current) {
        ref.current?.removeEventListener('play', audioPlay);
        ref.current?.removeEventListener('ended', audioEnded);
        ref.current?.removeEventListener('error', handleAudioError);
      }
    };
  }, [ref]);

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
