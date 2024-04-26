import LearningContentDetailCardsCTAs from './LearningContentDetailCardsCTAs';

const LearningContentDetail = ({ sentenceData, handleFlashCard }) => {
  const sentence = sentenceData[0];
  const textWithKanji = sentenceData[1];
  const textZeroKanji = sentenceData[2];
  const audioUrl = sentenceData[3];
  const definition = sentenceData[4];
  const engTranslation = sentenceData[5];
  const cardId = sentenceData[6];

  const formattedSentence = sentence.replace(
    new RegExp(textWithKanji, 'g'),
    `<span style="font-weight: bold; text-decoration: underline;">${textWithKanji}</span>`,
  );

  return (
    <div>
      <div>
        <p dangerouslySetInnerHTML={{ __html: formattedSentence }} />
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
          {textWithKanji}
        </span>
        <br />
        {textWithKanji !== textZeroKanji && (
          <>
            <span>{textZeroKanji}</span>
            <br />
          </>
        )}
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
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
      <LearningContentDetailCardsCTAs
        handleFlashCard={handleFlashCard}
        cardId={cardId}
      />
    </div>
  );
};

export default LearningContentDetail;
