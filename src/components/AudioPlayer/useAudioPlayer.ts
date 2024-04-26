import { useEffect, useState } from 'react';

const useAudioPlayer = ({
  ref,
  handleWhatAudioIsEnded,
  handleWhatAudioIsPlaying,
  setRefs,
  setMasterPlayPressed,
  inArrayIndex,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

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

  const audioPause = () => {
    if (ref.current.currentTime < ref.current.duration) {
      setMasterPlayPressed(false);
    }
  };

  const audioEnded = () => {
    return handleWhatAudioIsEnded(inArrayIndex);
  };

  const handleRefresh = () => {
    if (ref?.current) {
      ref.current.currentTime = 0; // Restart audio from the beginning
      ref.current.play();
    }
  };

  useEffect(() => {
    if (ref?.current) {
      ref.current.addEventListener('play', audioPlay);
      ref.current.addEventListener('pause', audioPause);
      ref.current.addEventListener('ended', audioEnded);
      ref.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (ref?.current) {
        ref.current?.removeEventListener('play', audioPlay);
        ref.current?.removeEventListener('pause', audioPause);
        ref.current?.removeEventListener('ended', audioEnded);
        ref.current?.removeEventListener('error', handleAudioError);
      }
    };
  }, [ref]);

  return { handleRefresh };
};

export default useAudioPlayer;
