const ResponseItem = ({ responseItem }) => {
  return (
    <div style={{ borderTop: '1px solid grey' }}>
      {responseItem.split('\n').map((detail, index) => {
        if (!detail) {
          return null;
        }
        return (
          <li key={index}>
            <p>{detail}</p>
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
