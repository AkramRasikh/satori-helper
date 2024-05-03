import {
  combinePrompt,
  moodIntensivePrompt,
  nonIndicativeIntensivePrompt,
  storyPrompt,
} from '@/prompts';

const promptOptions = [
  {
    label: 'Get story',
    option: storyPrompt,
  },
  {
    label: 'Combine words',
    option: combinePrompt,
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
    label: 'gpt-4',
    option: 'gpt-4',
  },
  {
    label: 'gpt-3.5-turbo',
    option: 'gpt-3.5-turbo',
  },
];

const audioOptions = [
  {
    label: 'With Audio (ChatGPT)',
    option: 'chatgpt',
  },
  {
    label: 'No Audio',
    option: 'No Audio',
  },
  {
    label: 'With Audio (Narakeet)',
    option: 'Narakeet',
  },
];

const GetContentActions = ({
  selectedOption,
  handlePromptChange,
  selectedModel,
  handleModelChange,
  selectedWithAudio,
  handleWithAudioChange,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <p>Choose a prompt:</p>
        {promptOptions.map((option, index) => {
          return (
            <label key={index}>
              <input
                type='radio'
                value={option.option}
                checked={selectedOption === option.option}
                onChange={handlePromptChange}
              />
              {option.label}
              <br />
            </label>
          );
        })}
      </div>
      <div>
        <p>Choose a model:</p>
        {chatgptModels.map((option, index) => {
          return (
            <label key={index}>
              <input
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
        <p>Choose a audio:</p>
        {audioOptions.map((option, index) => {
          return (
            <label key={index}>
              <input
                type='radio'
                value={option.option}
                checked={selectedWithAudio === option.option}
                onChange={handleWithAudioChange}
              />
              {option.label}
              <br />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default GetContentActions;
