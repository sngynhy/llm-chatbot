import { ChatAction, ChatState } from "types/reducer";

// 리듀서 함수
export const chatReducer = (
  state: ChatState = {},
  action: ChatAction
): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE": // 스트리밍 메시지 추가
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
      const { chatId: targetChatId } = action.payload;
      const newState = { ...state };
      delete newState[targetChatId];
      return newState;

    case "RESET_ALL_MESSAGES": // 모든 메시지 초기화
      return {};

    default:
      return state;
  }
};
