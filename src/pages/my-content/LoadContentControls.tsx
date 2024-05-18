const LoadContentControls = ({ topics, handleTopicLoad }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <p>
        <u>Content available:</u>
      </p>
      {topics?.map((topic) => {
        return (
          <button
            key={topic}
            style={{
              margin: 'auto 5px',
              padding: '5px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleTopicLoad(topic)}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
};

export default LoadContentControls;
