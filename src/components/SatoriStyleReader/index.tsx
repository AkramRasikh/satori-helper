import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { useEffect, useRef, useState } from 'react';
import SatoriLine from './SatoriLine';
import SatoriHighlightReviewActions from './SatoriHighlightReviewActions';
import SatoriHeaderActions from './SatoriHeaderActions';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import combineMP3Urls from '@/pages/api/combine-mp3-urls';
import useGetCombinedAudioData from './useGetCombinedAudioData';
import SatoriTitle from './SatoriTitle';
import SatoriAudioControls from './SatoriAudioControls';

const SatoriStyleReader = ({
  content,
  topic,
  pureWordsUnique,
  selectedTopicWords,
  handleAddToWordBank,
  getWordsContext,
  japaneseLoadedContentFullMP3s,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const unifiedAudioRef = useRef();
  const [isInHighlightMode, setIsInHighlightMode] = useState(false);
  const [hasUnifiedMP3API, setHasUnifiedMP3API] = useState(false);
  const [seperateLinesMode, setSeperateLinesMode] = useState(false);
  const [showAllEnglish, setShowAllEnglish] = useState(false);

  const [thisSentenceStudyWordsIndex, setThisSentenceStudyWordsIndex] =
    useState();
  const selection = window?.getSelection();

  const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
    (item) => item.name === topic,
  );

  const orderedContent = content.map((item, index) => {
    return {
      ...item,
      position: index,
    };
  });

  const { durations, fetchDurationsAgain } = useGetCombinedAudioData({
    hasUnifiedMP3File,
    audioFiles: orderedContent,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        unifiedAudioRef.current &&
        !unifiedAudioRef?.current?.paused &&
        durations?.length > 0
      ) {
        const currentTime = unifiedAudioRef.current?.currentTime;
        const currentAudioPlaying = durations.findIndex(
          (item) => currentTime < item.endAt && currentTime > item.startAt,
        );
        const newId = content[currentAudioPlaying]?.id;
        if (newId !== masterPlay) {
          setMasterPlay(newId);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [durations, masterPlay, content]);

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

  const reloadURL = () => {
    if (unifiedAudioRef.current) {
      unifiedAudioRef.current.load();
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

  const handleMasterPlaySegment = (startAt) => {
    if (unifiedAudioRef.current) {
      unifiedAudioRef.current.currentTime = startAt;
      unifiedAudioRef.current.play();
    }
  };

  const handleUnifiedUrl = async () => {
    const audioFiles = content.map((item) => getFirebaseAudioURL(item.id));
    try {
      const url = await combineMP3Urls({ mp3Name: topic, audioFiles });
      if (url) {
        setHasUnifiedMP3API(true);
      }
    } catch (error) {
      console.error('## handleUnifiedUrl error', error);
    }
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
        {hasUnifiedMP3File || hasUnifiedMP3API ? (
          <SatoriAudioControls
            handleAudioJump={handleAudioJump}
            unifiedAudioRef={unifiedAudioRef}
            getUrl={getFirebaseAudioURL}
            topic={topic}
            reloadURL={reloadURL}
            fetchDurationsAgain={fetchDurationsAgain}
          />
        ) : (
          <button onClick={handleUnifiedUrl}>Get unified URL</button>
        )}
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
      <div style={{ fontSize: '20px' }}>
        {durations?.map((item, index) => {
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
              isMusic={hasUnifiedMP3File}
              masterRef={unifiedAudioRef}
              handleMasterPlaySegment={handleMasterPlaySegment}
              showAllEnglish={showAllEnglish}
            />
          );
        })}
      </div>
      {thisSentenceStudyWords?.map((wordFromTopic) => (
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
