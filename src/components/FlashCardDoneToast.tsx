import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

const FlashCardDoneToast = ({ text, setFlashCardWordDone }) => {
  const [isRemoved, setIsRemoved] = useState(false);

  const handleDelete = () => {
    setTimeout(() => setIsRemoved(true), 2000);
  };

  useEffect(() => {
    handleDelete();
  }, []);

  return (
    <CSSTransition
      in={!isRemoved}
      timeout={2000}
      classNames='fade'
      unmountOnExit
      onExited={() => {
        setFlashCardWordDone('');
      }}
    >
      <p
        style={{
          margin: 'auto',
          position: 'absolute',
          right: '45%',
          fontSize: '20px',
          border: '3px solid green',
          borderRadius: '10px',
          padding: '10px',
          background: 'aliceblue',
        }}
      >
        {text}
      </p>
    </CSSTransition>
  );
};

export default FlashCardDoneToast;
