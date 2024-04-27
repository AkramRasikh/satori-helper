import { combinePrompt, storyPromptFormatted } from '@/prompts';

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
      onClickHandler: () => handleChatGPTRes(storyPromptFormatted),
    },
    {
      text: 'Get a story! GPT 4',
      onClickHandler: () => handleChatGPTRes(storyPromptFormatted, 'gpt-4'), // needs works,
    },
    {
      text: 'Combine words',
      onClickHandler: () => handleChatGPTRes(combinePrompt),
    },
    {
      text: 'Combine words (GPT4)',
      onClickHandler: () => handleChatGPTRes(combinePrompt, 'gpt-4'),
    },
    {
      text: 'Combine words + Audio',
      onClickHandler: () =>
        handleChatGPTRes(combinePrompt, 'gpt-3.5-turbo', true),
    },
    {
      text: 'Combine words + Audio (GPT4)',
      onClickHandler: () => handleChatGPTRes(combinePrompt, 'gpt-4', true),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: '10px',
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
