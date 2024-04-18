const ResponseItem = ({ responseItem }) => {
  let japaneseBareText = '';
  const japaneseRegex = /\[JP\]/;

  const handleGetAudio = async () => {
    if (!japaneseBareText) return null;
    try {
      // figure reference to code
      await fetch('/api/chatgpt-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tts: japaneseBareText }),
      });
    } catch (error) {
      console.error('## Error fetching data:', error);
    }
  };

  return (
    <div style={{ borderTop: '1px solid grey' }}>
      {responseItem.split('\n').map((detail, index) => {
        const isJapaneseText = japaneseRegex.test(detail);
        if (isJapaneseText) {
          japaneseBareText = detail.replace(japaneseRegex, '');
        }

        if (!detail) {
          return null;
        }
        return (
          <li key={index}>
            <p>{detail}</p>
            {isJapaneseText && (
              <button onClick={handleGetAudio}>Get Audio</button>
            )}
          </li>
        );
      })}
    </div>
  );
};
const ResponseSection = ({ response }) => {
  return (
    <ul style={{ borderBottom: '1px solid grey' }}>
      {response.map((responseItem, index) => (
        <ResponseItem key={index} responseItem={responseItem} />
      ))}
    </ul>
  );
};

export default ResponseSection;
