import { japaneseTextNoJapanaeseNeeded } from '@/prompts';

const ContentActions = ({
  handleMyTextTranslated,
  saveContentToFirebase,
  themeValue,
  isBilingualContentMode,
}) => {
  return (
    <div
      style={{
        width: '80%',
        margin: 'auto',
      }}
    >
      {isBilingualContentMode ? (
        <button
          onClick={() =>
            handleMyTextTranslated({
              withNara: 'narakeet',
              prompt: japaneseTextNoJapanaeseNeeded,
              pureJSON: true,
            })
          }
          style={{
            marginTop: '10px',
            marginLeft: '10px',
            padding: '5px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          My content + Nara
        </button>
      ) : (
        <button
          onClick={() => handleMyTextTranslated({ withNara: 'narakeet' })}
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
      )}
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
