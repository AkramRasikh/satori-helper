import AudioPlayerElement from '../AudioPlayer/AudioPlayerElement';
import LearningContentDetailCardsCTAs from './LearningContentDetailCardsCTAs';

const TargetNonPhoneticScript = ({ text }) => (
  <p dangerouslySetInnerHTML={{ __html: text }} />
);
const FormattedSentence = ({ text }) => <p>{text}</p>;

const Definition = ({ definition }) => (
  <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
    Eng: {definition}
  </p>
);

const EngTranslation = ({ engTranslation }) => (
  <p>
    <i> Eng: {engTranslation}</i>
  </p>
);

const LearningContentDetail = ({ sentenceData, handleFlashCard }) => {
  const sentence = sentenceData.fullSentence;
  const textWithKanji = sentenceData.textWithKanji;
  const textZeroKanji = sentenceData.textZeroKanji;
  const audioUrl = sentenceData.audioUrl;
  const definition = sentenceData.definition;
  const engTranslation = sentenceData.engTranslation;
  const cardId = sentenceData.cardId;

  const formattedSentence = sentence.replace(
    new RegExp(textWithKanji, 'g'),
    `<span style="font-weight: bold; text-decoration: underline;">${textWithKanji}</span>`,
  );

  return (
    <div>
      <TargetNonPhoneticScript text={formattedSentence} />
      <FormattedSentence text={textWithKanji} />
      {textWithKanji !== textZeroKanji && <p>{textZeroKanji}</p>}
      <Definition definition={definition} />
      <EngTranslation engTranslation={engTranslation} />
      <AudioPlayerElement url={audioUrl} />
      <LearningContentDetailCardsCTAs
        handleFlashCard={handleFlashCard}
        cardId={cardId}
      />
    </div>
  );
};

export default LearningContentDetail;
