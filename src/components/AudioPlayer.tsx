import { useEffect, useState } from 'react';

const AudioPlayer = ({ id, mp3AudioFile }) => {
  const audioElement = document?.getElementById(id);
  useEffect(() => {
    setTimeout(() => audioElement?.load(), 1000);
  }, [audioElement]);

  return (
    <div>
      <audio controls id={id}>
        <source src={mp3AudioFile} type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
