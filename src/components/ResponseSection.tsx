const ResponseSection = ({ response }) => {
  return (
    <ul style={{ borderBottom: '1px solid grey' }}>
      {response &&
        response.split('\n').map((detail, index) => {
          if (!detail) {
            return <br key={index} />;
          }
          return (
            <li key={index}>
              <p>{detail}</p>
            </li>
          );
        })}
    </ul>
  );
};

export default ResponseSection;
