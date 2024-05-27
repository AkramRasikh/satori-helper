import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { useEffect, useRef, useState } from 'react';
import SatoriLine from './SatoriLine';
import SatoriHighlightReviewActions from './SatoriHighlightReviewActions';
import SatoriHeaderActions from './SatoriHeaderActions';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import combineMP3Urls from '@/pages/api/combine-mp3-urls';
import AudioPlayerElement from '../AudioPlayer/AudioPlayerElement';
import useGetCombinedAudioData from './useGetCombinedAudioData';
import SatoriTitle from './SatoriTitle';

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

  const durations = useGetCombinedAudioData({
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

  const getThisSentenceStudyWords = () => {
    if (typeof thisSentenceStudyWordsIndex !== 'number') return null;

    const thisLine = content[thisSentenceStudyWordsIndex].targetLang;
    const wordsFromThisSentence = selectedTopicWords.filter(
      (word) =>
        thisLine.includes(word.baseForm) || thisLine.includes(word.surfaceForm),
    );
    return wordsFromThisSentence;
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
      <SatoriTitle topic={topic} />
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
        {hasUnifiedMP3File || hasUnifiedMP3API ? (
          <div>
            <AudioPlayerElement
              ref={unifiedAudioRef}
              url={getFirebaseAudioURL(topic)}
            />
          </div>
        ) : (
          <button onClick={handleUnifiedUrl}>Get unified URL</button>
        )}
        {highlightedWord && isInHighlightMode && (
          <SatoriHighlightReviewActions
            removeFromHighlightWordBank={removeFromHighlightWordBank}
            highlightedWord={highlightedWord}
            saveToWordBank={saveToWordBank}
          />
        )}
      </div>
      <div style={{ fontSize: '18px' }}>
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
