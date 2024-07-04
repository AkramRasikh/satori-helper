import { useEffect, useState } from 'react';

const useSatoriAudio = ({
  masterPlay,
  audioRef,
  setMasterPlay,
  isCurrentlyPlaying,
  item,
  isMusic,
  handleMasterPlaySegment,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlay = () => {
    setIsPlaying(true);
    setMasterPlay(item.id);
  };
  const audioPause = () => {
    setIsPlaying(false);
  };
  const audioEnded = () => {
    setIsPlaying(false);
  };
  const handleAudioError = () => {};

  const handlePlay = () => {
    if (isMusic && item?.startAt && audioRef?.current) {
      handleMasterPlaySegment(item.startAt);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current?.play();
    }
  };
  const handlePause = () => {
    audioRef.current?.pause();
  };

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.addEventListener('play', audioPlay);
      audioRef.current.addEventListener('pause', audioPause);
      audioRef.current.addEventListener('ended', audioEnded);
      audioRef.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (audioRef?.current) {
        audioRef.current?.removeEventListener('play', audioPlay);
        audioRef.current?.removeEventListener('pause', audioPause);
        audioRef.current?.removeEventListener('ended', audioEnded);
        audioRef.current?.removeEventListener('error', handleAudioError);
      }
    };
  }, [audioRef]);

  return {
    handlePlay,
    handlePause,
    isPlaying,
  };
};

export default useSatoriAudio;
