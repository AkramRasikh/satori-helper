import useHighlightWordToWordBank from '@/hooks/useHighlightWordToWordBank';
import JapaneseWordItem from '@/pages/my-content/JapaneseWordItem';
import { useState } from 'react';
import SatoriLine from './SatoriLine';
import SatoriHighlightReviewActions from './SatoriHighlightReviewActions';
import SatoriHeaderActions from './SatoriHeaderActions';
import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import combineMP3Urls from '@/pages/api/combine-mp3-urls';
import AudioPlayerElement from '../AudioPlayer/AudioPlayerElement';
import useGetCombinedAudioData from './useGetCombinedAudioData';

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
  const [isInHighlightMode, setIsInHighlightMode] = useState(false);
  const [hasUnifiedMP3API, setHasUnifiedMP3API] = useState(false);
  const [thisSentenceStudyWordsIndex, setThisSentenceStudyWordsIndex] =
    useState();
  const selection = window?.getSelection();

  const {
    handleHighlight,
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  } = useHighlightWordToWordBank(content, pureWordsUnique, selection);

  const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
    (item) => item.name === topic,
  );

  const audioFiles = content.map((item) => getFirebaseAudioURL(item.id));

  const durations = useGetCombinedAudioData({ hasUnifiedMP3File, audioFiles });

  console.log('## durations: ', durations);

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
      <h3
        style={{
          textAlign: 'center',
          margin: '0',
        }}
      >
        {topic}:
      </h3>
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
            <AudioPlayerElement url={getFirebaseAudioURL(topic)} />
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
