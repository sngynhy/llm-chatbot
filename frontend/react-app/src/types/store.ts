export type PromptType = "text" | "file";

export type NewPrompt = {
  type: PromptType;
  value: string | File;
};

export type ChatTitle = {
  chatId: string;
  title: string;
  isLatex?: boolean;
};

export type HistoryState = {
  currentchatId: string | null;
  setCurrentchatId: (id: string | null) => void;
  requestchatId: string | null;
  setRequestchatId: (id: string | null) => void;

  newPrompt: NewPrompt | null;
  setNewPrompt: (prompt: NewPrompt) => void;
  clearNewPrompt: () => void;

  chatIds: string[];
  chatTitles: ChatTitle[];
  setChatTitles: (titles: ChatTitle[]) => void;
  addChatId: (chatId: string) => void;
  addChatTitle: (title: ChatTitle) => void;
  removeTitle: (id: string) => void;
};
