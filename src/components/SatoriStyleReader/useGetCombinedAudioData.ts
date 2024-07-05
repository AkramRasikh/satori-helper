import { getFirebaseAudioURL } from '@/utils/getFirebaseAudioURL';
import { useEffect, useState } from 'react';

const useGetCombinedAudioData = ({ hasUnifiedMP3File, audioFiles }) => {
  const [durations, setDurations] = useState([]);

  const fetchDurationsAgain = async () => {
    const durationsPromises = await Promise.all(
      audioFiles.map(async (item) => {
        const url = getFirebaseAudioURL(item.id);
        const oneItem = await new Promise((resolve) => {
          const audio = new Audio(url);
          audio.addEventListener('loadedmetadata', () => {
            resolve({
              id: item.id,
              duration: audio.duration,
            });
          });
        });

        return oneItem;
      }),
    );

    let endAt = 0;

    const sortedAudios = audioFiles.map((audioItem) => {
      const thisDuration = durationsPromises.find(
        (item) => item.id === audioItem.id,
      ).duration;
      const startAt = endAt;
      endAt = endAt + thisDuration;
      return {
        ...audioItem,
        thisDuration,
        startAt,
        endAt,
      };
    });
    setDurations(sortedAudios);
  };
  useEffect(() => {
    const fetchDurations = async () => {
      const durationsPromises = await Promise.all(
        audioFiles.map(async (item) => {
          const url = getFirebaseAudioURL(item.id);
          const oneItem = await new Promise((resolve) => {
            const audio = new Audio(url);
            audio.addEventListener('loadedmetadata', () => {
              resolve({
                id: item.id,
                duration: audio.duration,
              });
            });
          });

          return oneItem;
        }),
      );

      let endAt = 0;

      const sortedAudios = audioFiles.map((audioItem) => {
        const thisDuration = durationsPromises.find(
          (item) => item.id === audioItem.id,
        ).duration;
        const startAt = endAt;
        endAt = endAt + thisDuration;
        return {
          ...audioItem,
          thisDuration,
          startAt,
          endAt,
        };
      });
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

  return { durations, fetchDurationsAgain };
};

export default useGetCombinedAudioData;
