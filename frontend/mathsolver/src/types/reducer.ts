export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  content: string;
  role: MessageRole;
  isLatex?: boolean;
  createdAt?: number;
}
export type ChatState = {
  [chatId: string]: ChatMessage[];
};

export interface AddMessageAction {
  type: "ADD_MESSAGE";
  payload: {
    chatId: string;
    content: string;
    role: MessageRole;
    isLatex?: boolean;
  };
}

export interface ResetMessageAction {
  type: "RESET_MESSAGE";
  payload: {
    chatId: string;
  };
}

export interface ResetAllMessagesAction {
  type: "RESET_ALL_MESSAGES";
}

export type ChatAction =
  | AddMessageAction
  | ResetMessageAction
  | ResetAllMessagesAction;

export const actionType = {
  addMessage: "ADD_MESSAGE",
  resetMessage: "RESET_MESSAGE",
  resetAllMessages: "RESET_ALL_MESSAGES",
};
