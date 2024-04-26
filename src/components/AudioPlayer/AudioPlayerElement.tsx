const AudioPlayerElement = ({ ref, url }) => {
  return (
    <audio controls ref={ref}>
      <source src={url} type='audio/mpeg' />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayerElement;
