const TextInput = ({
  inputValue,
  setInputValue,
  themeValue,
  setThemeValue,
  translatedText,
}) => {
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleThemeChange = (event) => {
    setThemeValue(event.target.value);
  };

  const renderBulletPoints = () => {
    if (!inputValue) return null;

    // Split inputValue by '*' character
    const parts = inputValue.split('*');

    // Render each part as a list item
    return (
      <ul>
        {parts.map((part, index) => (
          <li key={index}>{part.trim()}</li>
        ))}
      </ul>
    );
  };

  console.log('## translatedText: ', translatedText);

  return (
    <div>
      {translatedText?.length === 0 && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            <label htmlFor='textTheme'>Theme of text</label>
            <input
              type='text'
              id='textTheme'
              value={themeValue}
              onChange={handleThemeChange}
              style={{
                marginLeft: '10px',
              }}
            />
          </div>
          <textarea
            id='textInput'
            value={inputValue}
            onChange={handleInputChange}
            style={{
              display: 'block',
              width: '80%',
              minHeight: '50px',
              margin: 'auto',
            }}
          />
          {renderBulletPoints()}
        </div>
      )}
    </div>
  );
};

export default TextInput;
