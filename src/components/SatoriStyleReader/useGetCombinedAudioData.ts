import { useEffect, useState } from 'react';

const useGetCombinedAudioData = ({ hasUnifiedMP3File, audioFiles }) => {
  const [durations, setDurations] = useState([]);

  useEffect(() => {
    const fetchDurations = async () => {
      let endAt = 0;
      const durationsPromises = audioFiles.map((url) => {
        return new Promise((resolve) => {
          const audio = new Audio(url);
          audio.addEventListener('loadedmetadata', () => {
            const startAt = endAt;
            endAt = endAt + audio.duration;
            resolve({
              url,
              startAt,
              endAt,
            });
          });
        });
      });

      const durations = await Promise.all(durationsPromises);
      const sortedAudios = durations.sort((a, b) => a.startAt - b.startAt);
      setDurations(sortedAudios);
    };

    if (
      hasUnifiedMP3File &&
      audioFiles?.length > 0 &&
      !(durations?.length > 0)
    ) {
      fetchDurations();
    }
  }, [audioFiles, hasUnifiedMP3File, durations]);

  return durations;
};

export default useGetCombinedAudioData;
