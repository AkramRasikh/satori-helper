import {
  combinePrompt,
  dialoguePrompt,
  moodIntensivePrompt,
  nonIndicativeIntensivePrompt,
  storyPrompt,
} from '@/prompts';

const promptOptions = [
  {
    label: 'Get a story',
    option: storyPrompt,
  },
  {
    label: 'Combine words',
    option: combinePrompt,
  },
  {
    label: 'Short dialogue',
    option: dialoguePrompt,
  },
  {
    label: 'Mixed moods combine',
    option: moodIntensivePrompt,
  },
  {
    label: 'Non Indicative mood',
    option: nonIndicativeIntensivePrompt,
  },
];
const chatgptModels = [
  {
    label: 'GPT-4',
    option: 'gpt-4',
  },
  {
    label: 'GPT-4o',
    option: 'gpt-4o',
  },
  {
    label: 'GPT-3.5-turbo',
    option: 'gpt-3.5-turbo',
  },
];

const audioOptions = [
  {
    label: 'With Audio (ChatGPT)',
    option: '*',
  },
  {
    label: 'No Audio',
    option: '',
  },
  {
    label: 'With Audio (Narakeet)',
    option: 'narakeet',
    disabled: true,
  },
];

const GetContentActions = ({
  selectedPrompt,
  handlePromptChange,
  selectedModel,
  handleModelChange,
  selectedWithAudio,
  handleWithAudioChange,
  handleChatGPTRes,
  isLoadingResponse,
}) => {
  const disabledBtn = !selectedPrompt || !selectedModel || isLoadingResponse;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>
          <p style={{ margin: '5px' }}>Choose a prompt:</p>
          {promptOptions.map((option, index) => {
            return (
              <label key={index}>
                <input
                  style={{ margin: '7px' }}
                  type='radio'
                  value={option.option}
                  checked={selectedPrompt === option.option}
                  onChange={handlePromptChange}
                />
                {option.label}
                <br />
              </label>
            );
          })}
        </div>
        <div>
          <p style={{ margin: '5px' }}>Choose a model:</p>
          {chatgptModels.map((option, index) => {
            return (
              <label key={index}>
                <input
                  style={{ margin: '7px' }}
                  type='radio'
                  value={option.option}
                  checked={selectedModel === option.option}
                  onChange={handleModelChange}
                />
                {option.label}
                <br />
              </label>
            );
          })}
        </div>
        <div>
          <p style={{ margin: '5px' }}>Choose a audio:</p>
          {audioOptions.map((option, index) => {
            return (
              <label key={index}>
                <input
                  style={{ margin: '7px' }}
                  type='radio'
                  value={option.option}
                  checked={selectedWithAudio === option.option}
                  onChange={handleWithAudioChange}
                  disabled={option.disabled}
                />
                {option.label}
                <br />
              </label>
            );
          })}
        </div>
      </div>
      <button
        style={{
          margin: '10px auto',
          height: 'fit-content',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
        }}
        onClick={handleChatGPTRes}
        disabled={disabledBtn}
      >
        Lets go!
      </button>{' '}
    </div>
  );
};

export default GetContentActions;
