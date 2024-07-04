import { useState } from 'react';
import { loadInContent } from '../api/load-content';
import SatoriMusic from '@/components/SatoriStyleReader/SatoriMusic';

export default function MusicPage(props) {
  const japaneseSongsLoaded = props?.japaneseSongs;

  const [selectedSong, setSelectedSong] = useState(null);

  const getformattedContent = (content) => {
    return content.map((item, index) => {
      const isLastInArr = index + 1 === content.length;

      return {
        ...item,
        startAt: item.time,
        endAt: isLastInArr ? null : content[index + 1].time,
      };
    });
  };

  return (
    <div>
      <h1>Music page</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {japaneseSongsLoaded?.map((song) => {
          return (
            <button
              key={song.id}
              onClick={() => setSelectedSong(song)}
              style={{
                margin: 'auto 5px',
                padding: '5px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {song.title}
            </button>
          );
        })}
      </div>
      {selectedSong ? (
        <SatoriMusic
          content={getformattedContent(selectedSong.lyrics)}
          topic={selectedSong.title}
          pureWordsUnique={[]}
          selectedTopicWords={[]}
        />
      ) : null}
    </div>
  );
}

export async function getStaticProps() {
  try {
    const japaneseSongs = (await loadInContent({ ref: 'japaneseSongs' })) || [];
    return {
      props: { japaneseSongs: japaneseSongs.filter((item) => item !== null) },
    };
  } catch (error) {
    console.error('Error fetching data (Music):', error);
    return {
      props: { japaneseSongs: [] },
    };
  }
}
