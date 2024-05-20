const MyContentTextArea = ({
  inputValue,
  setInputValue,
  themeValue,
  setThemeValue,
}) => {
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleThemeChange = (event) => {
    setThemeValue(event.target.value);
  };

  return (
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
          padding: '10px',
        }}
      />
    </div>
  );
};

export default MyContentTextArea;
