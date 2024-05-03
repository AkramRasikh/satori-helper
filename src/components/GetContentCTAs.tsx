import {
  moodIntensivePrompt,
  nonIndicativeIntensivePrompt,
  storyPromptFormatted,
} from '@/prompts';

const GetContentActions = ({
  handleChatGPTRes,
  isLoadingResponse,
  handleClearWordBank,
  handleAllSentences,
}) => {
  const buttonStyling = {
    border: 'none',
    borderRadius: '15px',
    padding: '10px',
    cursor: 'pointer',
  };
  const contentActionsCTAs = [
    {
      text: 'Clear word bank 🏦!',
      onClickHandler: handleClearWordBank,
    },
    {
      text: 'All words + Audio (GPT4) 🌟',
      onClickHandler: handleAllSentences,
      styling: {
        border: '2px solid gold',
      },
    },
    {
      text: 'Get a story!',
      onClickHandler: () => handleChatGPTRes({ prompt: storyPromptFormatted }),
    },
    {
      text: 'Get a story! GPT 4',
      onClickHandler: () =>
        handleChatGPTRes({ prompt: storyPromptFormatted, model: 'gpt-4' }),
    },
    {
      text: 'Combine words',
      onClickHandler: () => handleChatGPTRes({ prompt: moodIntensivePrompt }),
    },
    {
      text: 'Combine words (GPT4)',
      onClickHandler: () =>
        handleChatGPTRes({ prompt: moodIntensivePrompt, model: 'gpt-4' }),
    },
    {
      text: 'Combine words (GPT4) + non-indicative',
      onClickHandler: () =>
        handleChatGPTRes({
          prompt: nonIndicativeIntensivePrompt,
          model: 'gpt-4',
        }),
    },
    {
      text: 'Combine words + Audio',
      onClickHandler: () =>
        handleChatGPTRes({
          prompt: moodIntensivePrompt,
          model: 'gpt-3.5-turbo',
          audio: '*',
        }),
    },
    {
      text: 'Combine words + Audio (GPT4)',
      onClickHandler: () =>
        handleChatGPTRes({
          prompt: moodIntensivePrompt,
          model: 'gpt-4',
          audio: '*',
        }),
    },
    {
      text: 'Combine words + Audio (GPT4) + Narakeet',
      onClickHandler: () =>
        handleChatGPTRes({
          prompt: moodIntensivePrompt,
          model: 'gpt-4',
          audio: 'narakeet',
        }),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: '10px',
        marginBottom: '10px',
      }}
    >
      {contentActionsCTAs.map((cta, index) => {
        return (
          <button
            key={index}
            style={{ ...buttonStyling, ...cta?.styling }}
            disabled={isLoadingResponse}
            onClick={cta.onClickHandler}
          >
            {cta.text}
          </button>
        );
      })}
    </div>
  );
};

export default GetContentActions;
