import SwitchButton from '@/components/SwitchButton';

const BilingualSwitch = ({
  setIsBilingualContentMode,
  isBilingualContentMode,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <span>{isBilingualContentMode ? 'Bilingual mode' : 'Standard mode'}</span>
      <SwitchButton
        isOn={isBilingualContentMode}
        setIsOn={setIsBilingualContentMode}
      />
    </div>
  );
};

export default BilingualSwitch;
