import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import { useEffect, useRef, useState } from 'react';
import SatoriLine from './SatoriLine';
import SatoriHighlightReviewActions from './SatoriHighlightReviewActions';
import SatoriHeaderActions from './SatoriHeaderActions';
import { getFirebaseSongsURL } from '@/utils/getFirebaseAudioURL';
import AudioPlayerElement from '../AudioPlayer/AudioPlayerElement';
import SatoriTitle from './SatoriTitle';

const SatoriMusic = ({
  content,
  topic,
  pureWordsUnique,
  selectedTopicWords,
}) => {
  const unifiedAudioRef = useRef();
  const [masterPlay, setMasterPlay] = useState('');
  const [isInHighlightMode, setIsInHighlightMode] = useState(false);
  const [thisSentenceStudyWordsIndex, setThisSentenceStudyWordsIndex] =
    useState();

  let selection;

  useEffect(() => {
    selection = window?.getSelection();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (unifiedAudioRef.current && !unifiedAudioRef?.current?.paused) {
        const currentTime = unifiedAudioRef.current?.currentTime;
        const duration = unifiedAudioRef.current?.duration;

        const currentAudioPlaying = content.findIndex(
          (item) =>
            currentTime < (item?.endAt || duration) &&
            currentTime > item.startAt,
        );

        const newId = content[currentAudioPlaying]?.id;
        if (newId !== masterPlay) {
          setMasterPlay(newId);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [masterPlay, content]);

  const {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  } = useHighlightWordToWordBank({
    pureWordsUnique,
    selection: null,
  });

  const handleAudioJump = (isRewind) => {
    if (unifiedAudioRef.current) {
      const currentTime = unifiedAudioRef.current.currentTime;
      const newTime = isRewind ? currentTime - 5 : currentTime + 5;
      unifiedAudioRef.current.currentTime = Math.max(0, newTime);
    }
  };

  const getThisSentenceStudyWords = () => {
    if (typeof thisSentenceStudyWordsIndex !== 'number') return null;

    const thisLine = content[thisSentenceStudyWordsIndex].targetLang;
    const wordsFromThisSentence = selectedTopicWords.filter(
      (word) =>
        thisLine.includes(word.baseForm) || thisLine.includes(word.surfaceForm),
    );
    return wordsFromThisSentence;
  };

  const handleDefinition = (index) => {
    if (index === thisSentenceStudyWordsIndex) {
      setThisSentenceStudyWordsIndex(undefined);
    } else {
      setThisSentenceStudyWordsIndex(index);
    }
  };

  const thisSentenceStudyWords = getThisSentenceStudyWords();

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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SatoriTitle topic={topic} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              marginRight: '10px',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => handleAudioJump(true)}
              style={{
                margin: 'auto',
                height: 'fit-content',
                padding: '15px',
                borderRadius: '15px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ⏪ - 5
            </button>
            <button
              onClick={() => handleAudioJump(false)}
              style={{
                margin: 'auto',
                height: 'fit-content',
                padding: '15px',
                borderRadius: '15px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ⏩ + 5
            </button>
          </div>
          <AudioPlayerElement
            ref={unifiedAudioRef}
            url={getFirebaseSongsURL(topic)}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <SatoriHeaderActions
          isInHighlightMode={isInHighlightMode}
          setIsInHighlightMode={setIsInHighlightMode}
        />

        {highlightedWord && isInHighlightMode && (
          <SatoriHighlightReviewActions
            removeFromHighlightWordBank={removeFromHighlightWordBank}
            highlightedWord={highlightedWord}
            saveToWordBank={saveToWordBank}
          />
        )}
      </div>
      <div style={{ fontSize: '20px' }}>
        {content?.map((item, index) => {
          return (
            <SatoriLine
              key={item.id}
              item={item}
              setMasterPlay={setMasterPlay}
              masterPlay={masterPlay}
              getSafeText={getSafeText}
              handleHighlight={handleHighlight}
              handleDefinition={handleDefinition}
              arrIndex={index}
              theseDefinitionsAreOpen={
                index === thisSentenceStudyWordsIndex &&
                thisSentenceStudyWords?.length > 0
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default SatoriMusic;
