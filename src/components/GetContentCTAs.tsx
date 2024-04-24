import { combinePrompt, storyPrompt, storyPromptFormatted } from '@/prompts';

const GetContentCTAs = ({
  handleChatGPTRes,
  isLoadingResponse,
  handleClearWordBank,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: '10px',
      }}
    >
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        disabled={isLoadingResponse}
        onClick={handleClearWordBank}
      >
        Clear word bank 🏦!
      </button>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        onClick={() => handleChatGPTRes(storyPrompt)}
        disabled={isLoadingResponse}
      >
        Get a story!
      </button>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        onClick={
          () => handleChatGPTRes(storyPrompt, 'gpt-4', storyPromptFormatted) // needs works
        }
        disabled={isLoadingResponse}
      >
        Get a story! GPT 4
      </button>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        onClick={() => handleChatGPTRes(combinePrompt)}
        disabled={isLoadingResponse}
      >
        Combine words
      </button>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        onClick={() => handleChatGPTRes(combinePrompt, 'gpt-4')}
        disabled={isLoadingResponse}
      >
        Combine words (GPT4)
      </button>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        disabled={isLoadingResponse}
        onClick={() => handleChatGPTRes(combinePrompt, 'gpt-3.5-turbo', true)}
      >
        Combine words + Audio
      </button>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
        disabled={isLoadingResponse}
        onClick={() => handleChatGPTRes(combinePrompt, 'gpt-4', true)}
      >
        Combine words + Audio (GPT4)
      </button>
    </div>
  );
};

export default GetContentCTAs;
