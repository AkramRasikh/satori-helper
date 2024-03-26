import React, { useState } from 'react';

const NestedStatus = () => {
  const [isTicked, setIsTicked] = useState(false);

  const handleDoneStatus = () => {
    setIsTicked(!isTicked);
  };
  return (
    <>
      <button onClick={handleDoneStatus}>Done?</button>
      {isTicked && <span>✅</span>}
    </>
  );
};

export default NestedStatus;
