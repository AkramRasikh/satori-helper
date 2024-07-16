import { thoughtsToBilingualText } from '.';

export const getThoughtsToBilingualText = ({
  inputValue,
  themeValue,
  prompt,
  bilingualJson,
}) => {
  let resultText = (prompt || thoughtsToBilingualText) + '\n';

  if (themeValue) {
    resultText = resultText + 'Theme of text: ' + themeValue + '\n';
  }

  if (inputValue && !bilingualJson) {
    resultText = resultText + inputValue;
  }

  if (bilingualJson) {
    resultText = resultText + JSON.stringify(bilingualJson);
  }

  return resultText;
};
