const SwitchButton = ({ isOn, setIsOn }) => {
  const toggleSwitch = () => {
    setIsOn((prevState) => !prevState);
  };

  const switchContainerStyle = {
    display: 'inline-block',
    padding: '10px',
    margin: 'auto',
    cursor: 'pointer',
  };

  const switchStyle = {
    width: '50px',
    height: '25px',
    backgroundColor: isOn ? 'green' : 'red',
    borderRadius: '25px',
    position: 'relative',
    transition: 'background-color 0.3s',
  };

  const switchHandleStyle = {
    width: '23px',
    height: '23px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '1px',
    left: isOn ? '26px' : '1px',
    transition: 'left 0.3s',
  };

  return (
    <div style={switchContainerStyle} onClick={toggleSwitch}>
      <div style={switchStyle}>
        <div style={switchHandleStyle} />
      </div>
    </div>
  );
};

export default SwitchButton;
