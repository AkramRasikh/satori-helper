import getSentenceAudio from '@/api/audio';
import satoriPendinghandler from '../api/pending';
import TopSection from '@/components/TopSection';

export default function Home(props) {
  const sentenceList = props?.satoriData;

  return (
    <div>
      <TopSection sentenceList={sentenceList} />
      <ul style={{ listStyleType: 'none', padding: '5px' }}>
        {sentenceList?.map((sentenceData, index) => {
          const sentence = sentenceData[0];
          const textWithKanji = sentenceData[1];
          const textZeroKanji = sentenceData[2];
          const audioUrl = sentenceData[3];
          const definition = sentenceData[4];
          const engTranslation = sentenceData[5];
          const formattedSentence = sentence.replace(
            new RegExp(textWithKanji, 'g'),
            `<span style="font-weight: bold; text-decoration: underline;">${textWithKanji}</span>`,
          );

          return (
            <li key={index} style={{ borderBottom: '1px solid black' }}>
              <div>
                <p dangerouslySetInnerHTML={{ __html: formattedSentence }} />
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  {textWithKanji}
                </span>
                <br />
                {textWithKanji !== textZeroKanji && (
                  <>
                    <span>{textZeroKanji}</span>
                    <br />
                  </>
                )}
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  Eng: {definition}
                </span>
              </div>
              <div>
                <span>
                  <i> Eng: {engTranslation}</i>
                </span>
              </div>
              <div>
                <audio controls>
                  <source src={audioUrl} type='audio/mpeg' />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const satoriData = await satoriPendinghandler();
    const getPathToWord = (inArrIndex) => {
      const thisWordsData = satoriData[inArrIndex];
      const expression = JSON.parse(thisWordsData.expression);

      const textParts =
        expression.paragraphs[0].sentences[0].runs[0].parts[0].parts;

      const textWithKanji = textParts.map((part) => part.text).join('');
      const textZeroKanji = textParts
        .map((part) => part?.reading || part.text)
        .join('');
      return [textWithKanji, textZeroKanji];
    };

    const satoriDataPlus = await Promise.all(
      satoriData.map(async (grandItem, index) => {
        const contexts = grandItem.contexts;

        const firstContext = contexts[0];
        const sentenceId = firstContext.sentenceId;
        const articleCode = firstContext.articleCode;

        const expression = JSON.parse(firstContext.expression);
        const paragraphs = expression.paragraphs;
        const firstNestedParagraph = paragraphs[0];
        const nestedSentences = firstNestedParagraph.sentences;
        const allParts = nestedSentences[0].runs[0].parts;
        const definition = JSON.parse(grandItem.definition).senses[0].glosses;
        const engTranslation = expression.notes[0].discussion;

        const [textWithKanji, textZeroKanji] = getPathToWord(index);

        const audioData = await getSentenceAudio(articleCode, sentenceId);

        return [
          allParts
            .map((item) => {
              if (item.text) {
                return item.text;
              }
              return item?.parts[0].text;
            })
            .join(''),
          textWithKanji,
          textZeroKanji,
          audioData?.url,
          definition,
          engTranslation,
        ];
      }),
    );

    return {
      props: {
        satoriData: satoriDataPlus,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        satoriData: null,
      },
    };
  }
}
