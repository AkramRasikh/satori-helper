import { useState } from 'react';
import { loadInContent } from '../api/load-content';
import SatoriMusic from '@/components/SatoriStyleReader/SatoriMusic';

export default function MusicPage(props) {
  const japaneseSongsLoaded = props?.japaneseSongs;
  console.log('## ', { japaneseSongsLoaded });

  const [audioName, setAudioName] = useState('');
  const [lyricsUrl, setLyricsUrl] = useState('');

  const handleFileName = (event) => {
    setAudioName(event.target.value);
  };
  const handleLyricsUrl = (event) => {
    setLyricsUrl(event.target.value);
  };

  const handleSRTSubmit = async (e) => {
    e.preventDefault();
    if (!audioName || !lyricsUrl) {
      return null;
    }
  };

  const content = japaneseSongsLoaded[0].lyrics;
  const topic = japaneseSongsLoaded[0].title;

  const formattedContent = content.map((item, index) => {
    const isLastInArr = index + 1 === content.length;

    return {
      ...item,
      startAt: item.time,
      endAt: isLastInArr ? null : content[index + 1].time,
    };
  });

  return (
    <div>
      <h1>Music page</h1>
      {topic ? (
        <SatoriMusic
          content={formattedContent}
          topic={topic}
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
