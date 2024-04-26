const AudioPlayerElement = ({ ref, url }) => {
  return (
    <div>
      <audio controls ref={ref}>
        <source src={url} type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayerElement;
