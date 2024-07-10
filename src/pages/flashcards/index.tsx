import { useRouter } from 'next/router';
import { flashcardData } from '../api/flashcard-data';
import FlashCardContainer from './FlashCardContainer';

export default function FlashCardPage(props) {
  const loadedFlashcardData = props?.loadedFlashcardData;
  const wordToContextData = loadedFlashcardData?.wordToContextData;

  const router = useRouter();

  const handleNavigateTo = (param) => {
    router.push(param);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Flash page</h1>
        <div style={{ margin: 'auto 0' }}>
          <button
            style={{
              margin: 'auto 0',
              padding: '5px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            onClick={() => handleNavigateTo('/my-content')}
          >
            /my-content
          </button>
          <button
            style={{
              margin: 'auto 0',
              padding: '5px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            onClick={() => handleNavigateTo('/music')}
          >
            /music
          </button>
        </div>
      </div>
      <div>
        <ul>
          {wordToContextData?.map((topicContainerProps) => {
            const baseForm = topicContainerProps.baseForm;

            return (
              <li key={baseForm}>
                <FlashCardContainer item={topicContainerProps} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const loadedFlashcardData = (await flashcardData()) || [];

    return {
      props: {
        loadedFlashcardData,
      },
    };
  } catch (error) {
    console.error('Error fetching data (Music):', error);
    return {
      props: { loadedFlashcardData: [] },
    };
  }
}

const wordToContextDataMock = {
  wordToContextData: [
    {
      baseForm: '公然',
      contexts: ['b238d0f3-0cd7-435b-8d05-477d86ac382c'],
      definition: 'openly',
      id: '98393848-f863-4355-ac1a-b1e5652df518',
      phonetic: 'こうぜん',
      surfaceForm: '公然',
      transliteration: 'Kōzen',
      // get the below on click
      contextToData: [
        {
          topic: 'politics-01',
          baseLang:
            'I don’t explicitly call myself a socialist but I feel close to the word.',
          hasAudio: 'b238d0f3-0cd7-435b-8d05-477d86ac382c',
          id: 'b238d0f3-0cd7-435b-8d05-477d86ac382c',
          notes: '',
          targetLang:
            '私は公然と自分自身を社会主義者と呼ぶわけではありませんが、その言葉に近い感じがします。',
        },
      ],
    },
  ],
};
