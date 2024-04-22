const AudioPlayer = ({ id, mp3AudioFile }) => (
  <div>
    <audio controls id={id}>
      <source src={mp3AudioFile} type='audio/mpeg' />
      Your browser does not support the audio element.
    </audio>
  </div>
);

export default AudioPlayer;
