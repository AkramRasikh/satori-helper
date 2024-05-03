const mockFlashcardResponse = async (cardId) => {
  return await new Promise((resolve) => {
    setTimeout(() => resolve({ cardId }), 1000);
  });
};

export default mockFlashcardResponse;
