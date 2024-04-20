import { combinePrompt, storyPrompt } from '@/prompts';

const GetContentCTAs = ({
  handleChatGPTRes,
  isLoadingResponse,
  handleClearWordBank,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <button
        style={{
          border: 'none',
          borderRadius: '15px',
          padding: '10px',
          cursor: 'pointer',
        }}
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
        onClick={() => handleChatGPTRes(combinePrompt)}
        disabled={isLoadingResponse}
      >
        Combine words
      </button>
    </div>
  );
};

export default GetContentCTAs;
