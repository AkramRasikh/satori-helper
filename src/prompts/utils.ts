import { thoughtsToBilingualText } from '.';

export const getThoughtsToBilingualText = (text, theme) => {
  let resultText = thoughtsToBilingualText + '\n';

  if (theme) {
    resultText = resultText + 'Theme of text: ' + theme + '\n';
  }

  if (text) {
    resultText = resultText + text;
  }

  return resultText;
};
