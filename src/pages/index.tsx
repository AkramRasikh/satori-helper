import getSentenceAudio from '@/api/audio';
import satoriPendinghandler from '../api/pending';

export default function Home(props) {
  const sentenceList = props?.satoriData;
  return (
    <div>
      <ul>
        {sentenceList?.map((sentenceData, index) => {
          const sentence = sentenceData[0];
          const textWithKanji = sentenceData[1];
          const textZeroKanji = sentenceData[2];
          const audioUrl = sentenceData[3];
          const formattedSentence = sentence.replace(
            new RegExp(textWithKanji, 'g'),
            `<span style="font-weight: bold; text-decoration: underline;">${textWithKanji}</span>`,
          );

          return (
            <li key={index}>
              <p dangerouslySetInnerHTML={{ __html: formattedSentence }} />
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {textWithKanji} AKA {textZeroKanji}
              </span>
              <audio controls>
                <source src={audioUrl} type='audio/mpeg' />
                Your browser does not support the audio element.
              </audio>
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

      console.log(
        '## parts',
        expression.paragraphs[0].sentences[0].runs[0].parts[0].parts,
      );

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

// [
//   {
//     userID: 'cb73d4d1-ba4a-4f20-9623-e622bd07f4d7',
//     userSetKey: 'cb73d4d1-ba4a-4f20-9623-e622bd07f4d7',
//     cardId: '5284505f-1a74-42de-9531-43c6678e9ab6',
//     entryId: 'd192e5a5-f3ef-470f-9c4e-de6c476c55eb',
//     senseId: '32afc371-757f-40fe-9f5e-eb8779c074a4',
//     cardType: 'JE',
//     whenCreated: '2024-01-25T09:59:17.606073+00:00',
//     expression:
//       '{"id":"qnfeASICYeaKZtuChrRt","code":null,"paragraphs":[{"id":"wlBsqqmvCtUqdBSsJDnL","type":0,"sentences":[{"id":"VSLGUzCPPJOdMweDaaro","runs":[{"id":"PBPtvNdvFMiVOTaMcXRS","parts":[{"id":"DuhXqeJNuXGqPbmNiiNr","kanjiKnowledge":0,"form":1,"parts":[{"id":"VkedCOQjIsbPHpeuDevC","text":"辺","reading":"あた"},{"id":"ONXpcjxZQAVWkRklaRjD","text":"り","reading":null},{"id":"iLijQdrnOGukzbfWHAkJ","text":"一面","reading":"いちめん"}]}]}],"audioPosition":0}]}]}',
//     definition:
//       '{"isContextDemonstrative":true,"senses":[{"isContextSense":true,"id":"32afc371-757f-40fe-9f5e-eb8779c074a4","partsOfSpeech":"exp","notes":"","glosses":"all around; as far as the eye can see"}],"id":"d192e5a5-f3ef-470f-9c4e-de6c476c55eb"}',
//     contexts: [
//       {
//         userID: null,
//         userSetKey: null,
//         cardId: '5284505f-1a74-42de-9531-43c6678e9ab6',
//         whenCreated: '2024-01-25T09:59:29.0286297+00:00',
//         sentenceId: 'VrvmGlgYawEtioCHhyjJ', <---
//         articleCode: 'oku-nikkou-episode-26-edition-n', <---
//         audio: {
//           isAccessibleForUser: true,
//           isAvailableLocally: false,
//         },
//       },
//     ],
//     totalCorrect: 4,
//     totalIncorrect: 0,
//     consecutiveCorrect: 4,
//     ef: 2.5,
//     q: 5,
//     whenUpdated: '2024-02-21T12:32:20.27918+00:00',
//     nextDueDate: '2024-03-21T02:00:00+00:00',
//   },
// ];
