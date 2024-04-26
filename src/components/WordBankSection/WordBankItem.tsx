const WordBankItem = ({ handleRemoveFromBank, word }) => (
  <li>
    <button
      onClick={() => handleRemoveFromBank(word.word)}
      style={{
        border: 'grey',
        fontSize: '15px',
        borderRadius: '15%',
        cursor: 'pointer',
        marginRight: '10px',
      }}
    >
      <span>❌</span>
    </button>
    <span>
      {word.word} context: {word.context}
    </span>
  </li>
);

export default WordBankItem;
