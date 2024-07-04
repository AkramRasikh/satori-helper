import SwitchButton from '../SwitchButton';

const SatoriHeaderActions = ({
  isInHighlightMode,
  setIsInHighlightMode,
  seperateLinesMode,
  setSeperateLinesMode,
  showAllEnglish,
  setShowAllEnglish,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: 'auto' }}>
        <span>{isInHighlightMode ? 'Highlight mode' : 'Review mode'}</span>
      </div>
      <SwitchButton isOn={isInHighlightMode} setIsOn={setIsInHighlightMode} />
      <div style={{ margin: 'auto' }}>
        <span>Seperate lines</span>
      </div>
      <SwitchButton isOn={seperateLinesMode} setIsOn={setSeperateLinesMode} />
      <div style={{ margin: 'auto' }}>
        <span>Show all Eng</span>
      </div>
      <SwitchButton isOn={showAllEnglish} setIsOn={setShowAllEnglish} />
    </div>
  );
};

export default SatoriHeaderActions;
