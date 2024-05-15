const ContentActions = ({
  handleMyTextTranslated,
  saveContentToFirebase,
  themeValue,
}) => {
  return (
    <div
      style={{
        width: '80%',
        margin: 'auto',
      }}
    >
      <button
        onClick={handleMyTextTranslated}
        style={{
          marginTop: '10px',
          padding: '5px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Translate content
      </button>
      <button
        onClick={() => handleMyTextTranslated('narakeet')}
        style={{
          marginTop: '10px',
          marginLeft: '10px',
          padding: '5px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Translate content + Nara
      </button>
      <div
        style={{
          borderRight: '1px solid black',
          height: '100%',
          display: 'inline',
          marginLeft: '10px',
        }}
      />
      <button
        onClick={saveContentToFirebase}
        style={{
          marginTop: '10px',
          marginLeft: '10px',
          padding: '5px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Save to Firebase {themeValue}
      </button>
    </div>
  );
};

export default ContentActions;
