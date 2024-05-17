import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useEffect, useRef, useState } from 'react';

const SatoriLine = ({
  item,
  masterPlay,
  setMasterPlay,
  getSafeText,
  handleHighlight,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const isCurrentlyPlaying = masterPlay === item.id;

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

  useEffect(() => {
    if (audioRef.current && !isCurrentlyPlaying) {
      audioRef.current?.pause();
      audioRef.current.currentTime = 0;
    }
  }, [masterPlay, audioRef.current]);

  const handlePlay = () => {
    audioRef.current.currentTime = 0;
    audioRef.current?.play();
  };
  const handlePauuse = () => {
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

  return (
    <div key={item.id} style={{ display: 'inline' }}>
      <button
        onClick={isPlaying ? handlePauuse : handlePlay}
        id='play-audio'
        style={{
          border: 'none',
          background: 'none',
          margin: '2px',
          borderRadius: '5px',
        }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <span
        style={{
          background: isCurrentlyPlaying ? 'yellow' : 'none',
        }}
        onMouseUp={handleHighlight}
      >
        {getSafeText(item.targetLang)}
      </span>
      {item.hasAudio ? (
        <audio ref={audioRef} src={getFirebaseAudioURL(item.hasAudio)} />
      ) : null}
    </div>
  );
};

const SwitchButton = ({ isInHighlightMode, setIsInHighlightMode }) => {
  const toggleSwitch = () => {
    setIsInHighlightMode((prevState) => !prevState);
  };

  const switchContainerStyle = {
    display: 'inline-block',
    padding: '10px',
    margin: 'auto',
    cursor: 'pointer',
  };

  const switchStyle = {
    width: '50px',
    height: '25px',
    backgroundColor: isInHighlightMode ? 'green' : 'red',
    borderRadius: '25px',
    position: 'relative',
    transition: 'background-color 0.3s',
  };

  const switchHandleStyle = {
    width: '23px',
    height: '23px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '1px',
    left: isInHighlightMode ? '26px' : '1px',
    transition: 'left 0.3s',
  };

  return (
    <div style={switchContainerStyle} onClick={toggleSwitch}>
      <div style={switchStyle}>
        <div style={switchHandleStyle} />
      </div>
    </div>
  );
};

const SatoriStyleReader = ({
  content,
  topic,
  pureWordsUnique,
  selectedTopicWords,
  handleAddToWordBank,
  getWordsContext,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [isInHighlightMode, setIsInHighlightMode] = useState(false);
  const selection = window?.getSelection();

  const {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  } = useHighlightWordToWordBank(content, pureWordsUnique, selection);

  const savedWordsDefinition = selectedTopicWords.filter(
    (word) =>
      word.baseForm === highlightedWord || word.surfaceForm === highlightedWord,
  );

  const getSafeText = (targetText) => {
    const text = underlineWordsInSentence(targetText, isInHighlightMode);

    return (
      <p
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          margin: '5px 0',
          display: 'inline',
        }}
      />
    );
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h3>{topic}:</h3>
        <div style={{ display: 'flex' }}>
          <div style={{ margin: 'auto' }}>
            <span>{isInHighlightMode ? 'Highlight mode' : 'Review mode'}</span>
          </div>
          <SwitchButton
            isInHighlightMode={isInHighlightMode}
            setIsInHighlightMode={setIsInHighlightMode}
          />
        </div>
        {highlightedWord && isInHighlightMode && (
          <p>
            Send Word to DB:{' '}
            <span
              style={{
                margin: '5px',
              }}
            >
              <button
                style={{
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
                onClick={removeFromHighlightWordBank}
              >
                Remove word ❌
              </button>
              <span>{highlightedWord}</span>
              <button
                style={{
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
                onClick={saveToWordBank}
              >
                Add word 🤙🏽
              </button>
            </span>
          </p>
        )}
      </div>
      <div>
        {content?.map((item) => {
          return (
            <SatoriLine
              key={item.id}
              item={item}
              setMasterPlay={setMasterPlay}
              masterPlay={masterPlay}
              underlineWordsInSentence={underlineWordsInSentence}
              getSafeText={getSafeText}
              handleHighlight={handleHighlight}
            />
          );
        })}
      </div>
      {savedWordsDefinition?.map((wordFromTopic) => (
        <JapaneseWordItem
          key={wordFromTopic.id}
          japaneseWord={wordFromTopic}
          handleAddToWordBank={handleAddToWordBank}
          getWordsContext={getWordsContext}
        />
      ))}
    </div>
  );
};

export default SatoriStyleReader;
