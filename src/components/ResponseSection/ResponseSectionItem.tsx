import { useState } from 'react';
import MasterAudioActions from '../MasterAudioActions';
import ResponseSectionContentContainer from './ResponseSectionContentContainer';

const ResponseSectionItem = ({
  responseItem,
  wordBank,
  handleDeleteSentence,
  mp3Bank,
  saveContentToFirebaseSatori,
  getNarakeetAudioFunc,
}) => {
  const [audioRefs, setAudioRefs] = useState([]);
  const [audioToPlay, setAudioToPlay] = useState(0);
  const [isNowPlaying, setIsNowPlaying] = useState();
  const [masterPlayPressed, setMasterPlayPressed] = useState(false);

  const setRefs = (ref, index) => {
    const updatedAudioRefs =
      audioRefs?.length === 0
        ? [{ ref, index }]
        : [...audioRefs, { ref, index }];
    if (updatedAudioRefs?.length === 1) {
      setAudioRefs(updatedAudioRefs);
    } else {
      setAudioRefs(updatedAudioRefs.sort((a, b) => a.index - b.index));
    }
  };

  const handleAudioPause = (index) => {
    if (audioRefs[index].ref?.current) {
      console.log('## handleAudioPause 2');
      audioRefs[index].ref.current.pause();
    }
  };

  const setRestart = () => {
    setAudioToPlay(0);
  };

  const handleAudioEnd = (index) => {
    console.log('## Ended? index: ', index);
  };
  const handleAudioPlay = (index) => {
    console.log('## Playing? index: ', index);
  };

  const handleWhatAudioIsPlaying = (index) => {
    setIsNowPlaying(index);
  };

  const handleWhatAudioIsEnded = (index) => {
    setAudioRefs((prevAudioRefs) => {
      const nextInArr = index + 1;
      const triggerNextAudio = nextInArr < prevAudioRefs.length;
      if (triggerNextAudio) {
        setAudioToPlay(nextInArr);
      }
      return prevAudioRefs;
    });
  };
  return (
    <>
      <MasterAudioActions
        audioRefs={audioRefs}
        handleAudioEnd={handleAudioEnd}
        handleAudioPlay={handleAudioPlay}
        audioToPlay={audioToPlay}
        setRestart={setRestart}
        handleAudioPause={handleAudioPause}
        masterPlayPressed={masterPlayPressed}
        setMasterPlayPressed={setMasterPlayPressed}
      />
      <div>
        {responseItem.map((detail, index) => {
          return (
            <ResponseSectionContentContainer
              key={index}
              inArrayIndex={index}
              detail={detail}
              handleDeleteSentence={handleDeleteSentence}
              mp3Bank={mp3Bank}
              setRefs={setRefs}
              handleWhatAudioIsPlaying={handleWhatAudioIsPlaying}
              handleWhatAudioIsEnded={handleWhatAudioIsEnded}
              isNowPlaying={isNowPlaying}
              setMasterPlayPressed={setMasterPlayPressed}
              saveContentToFirebaseSatori={saveContentToFirebaseSatori}
              getNarakeetAudioFunc={getNarakeetAudioFunc}
            />
          );
        })}
      </div>
    </>
  );
};

export default ResponseSectionItem;
