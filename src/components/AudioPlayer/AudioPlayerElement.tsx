import React from 'react';

const AudioPlayerElement = ({ url }, ref) => {
  return (
    <div>
      <audio controls ref={ref}>
        <source src={url} type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default React.forwardRef(AudioPlayerElement);
