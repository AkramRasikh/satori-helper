const LoadContentControls = ({ topics, handleTopicLoad }) => {
  return (
    <div>
      <p>Load Content:</p>
      {topics?.map((topic) => {
        return (
          <button
            key={topic}
            style={{
              marginTop: '10px',
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
