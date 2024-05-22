import SwitchButton from '../SwitchButton';

const SatoriHeaderActions = ({ isInHighlightMode, setIsInHighlightMode }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: 'auto' }}>
        <span>{isInHighlightMode ? 'Highlight mode' : 'Review mode'}</span>
      </div>
      <SwitchButton isOn={isInHighlightMode} setIsOn={setIsInHighlightMode} />
    </div>
  );
};

export default SatoriHeaderActions;
