import { useState } from 'react';
import ResponseCTAs from '../ResponseCTAs';
import AudioPlayer from '../AudioPlayer';
import getChatGptTTS from '@/pages/api/tts-audio';
import getKanjiToHiragana from '@/pages/api/kanji-to-hiragana';

const ResponseSectionContentContainer = ({
  detail,
  handleDeleteSentence,
  mp3Bank,
  setRefs,
  inArrayIndex,
  handleWhatAudioIsPlaying,
  handleWhatAudioIsEnded,
  isNowPlaying,
  setMasterPlayPressed,
}) => {
  const [audioUrlIsAvailable, setAudioUrlIsAvailable] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [noKanjiSentence, setNoKanjiSentence] = useState('');

  const japaneseSentence = detail.targetLang;
  const englishSentence = detail.baseLang;

  const isAudioInMP3Banks = audioUrlIsAvailable || mp3Bank?.includes(detail.id);
  const getAudioURL = (mp3FileName: string) => {
    const baseURL = process.env.NEXT_PUBLIC_FIREBASE_AUDIO_URL;
    const firebaseToken = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_ID;
    const url = `${baseURL}${mp3FileName}.mp3?alt=media&token=${firebaseToken}`;

    return url;
  };

  const handleDeleteClick = () => {
    handleDeleteSentence(detail.id);
  };

  const handleGetAudio = async () => {
    if (!japaneseSentence) return null;
    try {
      setLoadingResponse(true);
      const mp3FilesOnServer = await getChatGptTTS({
        id: detail.id,
        sentence: japaneseSentence,
      });

      mp3FilesOnServer.includes(detail.id + '.mp3');
      setAudioUrlIsAvailable(true);
    } catch (error) {
      console.error('## Error fetching data:', error);
    } finally {
      setLoadingResponse(false);
    }
  };

  const getKanjiFreeSentence = async () => {
    try {
      setLoadingResponse(true);
      const response = await getKanjiToHiragana({ sentence: japaneseSentence });
      setNoKanjiSentence(response);
    } catch (error) {
      console.error('Error fetching Kuromoji dictionary:', error);
      throw error;
    } finally {
      setLoadingResponse(false);
    }
  };

  if (!detail) {
    return null;
  }

  return (
    <li style={{ marginBottom: '10px' }}>
      <div
        style={{
          flexWrap: 'wrap',
          display: 'flex',
        }}
      >
        <p
          dangerouslySetInnerHTML={{ __html: detail.underlinedText }}
          style={{
            margin: '5px 0',
            background: isNowPlaying === inArrayIndex ? 'yellow' : 'none',
          }}
        />
        <ResponseCTAs
          loadingResponse={loadingResponse}
          handleDeleteClick={handleDeleteClick}
          handleGetAudio={handleGetAudio}
          getKanjiFreeSentence={getKanjiFreeSentence}
        />
      </div>
      {noKanjiSentence && <p style={{ margin: '5px 0' }}>{noKanjiSentence}</p>}
      <p style={{ margin: '5px 0' }}>{englishSentence}</p>
      {detail?.moodUsed && (
        <p style={{ margin: '5px 0' }}>Mood: {detail?.moodUsed}</p>
      )}
      {isAudioInMP3Banks && (
        <AudioPlayer
          mp3AudioFile={getAudioURL(detail.id)}
          setRefs={setRefs}
          inArrayIndex={inArrayIndex}
          handleWhatAudioIsPlaying={handleWhatAudioIsPlaying}
          handleWhatAudioIsEnded={handleWhatAudioIsEnded}
          setMasterPlayPressed={setMasterPlayPressed}
        />
      )}
    </li>
  );
};
export default ResponseSectionContentContainer;
