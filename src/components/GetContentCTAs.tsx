import { combinePrompt, storyPrompt } from '@/prompts';

const GetContentCTAs = ({ handleChatGPTRes, isLoadingResponse }) => {
  return (
    <div>
      <button
        onClick={() => handleChatGPTRes(storyPrompt)}
        disabled={isLoadingResponse}
      >
        Get a story!
      </button>
      <button
        onClick={() => handleChatGPTRes(combinePrompt)}
        disabled={isLoadingResponse}
      >
        Combine words
      </button>
      {isLoadingResponse && <span>Loading response!</span>}
    </div>
  );
};

export default GetContentCTAs;
