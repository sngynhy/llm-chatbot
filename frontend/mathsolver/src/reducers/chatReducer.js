export const actionType = {
  addMessage: "ADD_MESSAGE",
  resetMessage: "RESET_MESSAGE",
  resetChatMessages: "RESET_CHAT_MESSAGES",
};

export const chatReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      const { chatId, content, role, isLatex } = action.payload;
      const existingMessages = state[chatId] || [];
      return {
        ...state,
        [chatId]: [
          ...existingMessages,
          {
            content,
            role,
            isLatex: isLatex || false,
            createdAt: Date.now(),
          },
        ],
      };

    case "RESET_MESSAGE": // 특정 chatId의 메시지만 초기화
      console.log("RESET_MESSAGE", action);
      const { chatId: targetChatId } = action.payload;
      const newState = { ...state };
      delete newState[targetChatId];
      return newState;

    case "RESET_CHAT_MESSAGES": // 모든 메시지 초기화
      return {};

    default:
      return state;
  }
};
