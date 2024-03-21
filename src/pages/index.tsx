import satoriPendinghandler from '../api/pending';

export default function Home(props) {
  const getPathToWord = (inArrIndex) => {
    const thisWordsData = props.satoriData[inArrIndex];
    const expression = JSON.parse(thisWordsData.expression);

    return expression.paragraphs[0].sentences[0].runs[0].parts[0].parts
      .map((part) => part.text)
      .join('');
  };

  const getSentences = () =>
    props.satoriData.map((grandItem, index) => {
      const contexts = grandItem.contexts;
      const firstContext = contexts[0];
      const expression = JSON.parse(firstContext.expression);
      const paragraphs = expression.paragraphs;
      const firstNestedParagraph = paragraphs[0];
      const nestedSentences = firstNestedParagraph.sentences;
      const allParts = nestedSentences[0].runs[0].parts;

      const pathToWordStudied = getPathToWord(index);

      return [
        allParts
          .map((item) => {
            if (item.text) {
              return item.text;
            }
            return item?.parts[0].text;
          })
          .join(''),
        pathToWordStudied,
      ];
    });

  const sentenceList = getSentences();

  return (
    <div>
      <ul>
        {sentenceList.map((sentenceData, index) => {
          const sentence = sentenceData[0];
          const wordInQuestion = sentenceData[1];
          const formattedSentence = sentence.replace(
            new RegExp(wordInQuestion, 'g'),
            `<span style="font-weight: bold; text-decoration: underline;">${wordInQuestion}</span>`,
          );

          return (
            <li key={index}>
              <p dangerouslySetInnerHTML={{ __html: formattedSentence }} />
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {wordInQuestion}
              </span>
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

    return {
      props: {
        satoriData,
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
