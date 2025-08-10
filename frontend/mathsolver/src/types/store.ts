export type QuestionType = "text" | "file";

export type NewQuestion = {
  type: QuestionType;
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

  newQuestion: NewQuestion | null;
  setNewQuestion: (question: NewQuestion) => void;
  clearNewQuestion: () => void;

  chatIds: string[];
  chatTitles: ChatTitle[];
  setChatTitles: (titles: ChatTitle[]) => void;
  addChatId: (chatId: string) => void;
  addChatTitle: (title: ChatTitle) => void;
  removeTitle: (id: string) => void;
};
