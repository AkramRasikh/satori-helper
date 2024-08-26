import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import { useEffect, useRef, useState } from 'react';
import SatoriLine from './SatoriLine';
import SatoriHighlightReviewActions from './SatoriHighlightReviewActions';
import SatoriHeaderActions from './SatoriHeaderActions';
import { getFirebaseSongsURL } from '@/utils/getFirebaseAudioURL';
import SatoriTitle from './SatoriTitle';
import SatoriAudioControls from './SatoriAudioControls';

const SatoriMusic = ({
  content,
  topic,
  pureWordsUnique,
  selectedTopicWords,
}) => {
  const unifiedAudioRef = useRef();
  const [masterPlay, setMasterPlay] = useState('');
  const [isInHighlightMode, setIsInHighlightMode] = useState(false);
  const [seperateLinesMode, setSeperateLinesMode] = useState(true);
  const [showAllEnglish, setShowAllEnglish] = useState(false);
  const [thisSentenceStudyWordsIndex, setThisSentenceStudyWordsIndex] =
    useState();

  let selection = window?.getSelection();

  const audioIsloaded = unifiedAudioRef?.current;

  const reloadURL = () => {
    if (unifiedAudioRef.current) {
      unifiedAudioRef.current.load();
    }
  };

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
    selection,
  });

  const handleMasterPlaySegment = (startAt) => {
    if (unifiedAudioRef.current) {
      unifiedAudioRef.current.currentTime = startAt;
      unifiedAudioRef.current.play();
    }
  };
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
        <SatoriAudioControls
          handleAudioJump={handleAudioJump}
          unifiedAudioRef={unifiedAudioRef}
          getUrl={getFirebaseSongsURL}
          topic={topic}
          reloadURL={reloadURL}
        />
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
          seperateLinesMode={seperateLinesMode}
          setSeperateLinesMode={setSeperateLinesMode}
          showAllEnglish={showAllEnglish}
          setShowAllEnglish={setShowAllEnglish}
        />

        {highlightedWord && isInHighlightMode && (
          <SatoriHighlightReviewActions
            removeFromHighlightWordBank={removeFromHighlightWordBank}
            highlightedWord={highlightedWord}
            saveToWordBank={saveToWordBank}
          />
        )}
      </div>
      <div
        style={{
          fontSize: '20px',
          overflowY: 'scroll',
          maxHeight: window?.innerHeight
            ? `${window.innerHeight * 0.7}px`
            : '500px',
        }}
      >
        {audioIsloaded &&
          content?.map((item, index) => {
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
                seperateLinesMode={seperateLinesMode}
                showAllEnglish={showAllEnglish}
                masterRef={unifiedAudioRef}
                handleMasterPlaySegment={handleMasterPlaySegment}
                isMusic
              />
            );
          })}
      </div>
    </div>
  );
};

export default SatoriMusic;
