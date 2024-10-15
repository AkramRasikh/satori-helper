import { thoughtsToBilingualText } from '.';

export const getThoughtsToBilingualText = ({
  inputValue,
  themeValue,
  prompt,
  bilingualJson,
  contextInputValue,
}) => {
  let resultText = (prompt || thoughtsToBilingualText) + '\n';

  if (themeValue) {
    resultText = resultText + 'Theme of text: ' + themeValue + '\n';
  }

  if (inputValue && !bilingualJson) {
    resultText = resultText + inputValue;
  }

  if (contextInputValue) {
    resultText =
      resultText +
      '\n' +
      '\n' +
      'Here is additional context to make sense of my text to translate:' +
      '\n' +
      contextInputValue +
      '\n';
  }

  if (bilingualJson) {
    resultText = resultText + JSON.stringify(bilingualJson);
  }

  return resultText;
};
