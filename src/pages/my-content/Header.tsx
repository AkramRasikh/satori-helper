const Header = ({ handleNavigateTo }) => {
  return (
    <>
      <h2 style={{ margin: '5px', textAlign: 'center' }}>
        My Japanese Content
      </h2>
      <div
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
        }}
      >
        <button
          style={{
            margin: 'auto 0',
            padding: '5px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          onClick={() => handleNavigateTo('/')}
        >
          /home
        </button>
        <button
          style={{
            margin: 'auto 0',
            padding: '5px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => handleNavigateTo('/music')}
        >
          /music
        </button>
      </div>
    </>
  );
};

export default Header;
