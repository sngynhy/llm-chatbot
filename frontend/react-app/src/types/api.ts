export type StreamRequest = {
  chatId: string;
  prompt: string;
  title: string;
  titleIsLatex: boolean;
};

export type ChatResponse = {
  chatId: string;
  title: string;
  titleIsLatex: boolean;
  messages: Message[];
};

export type Message = {
  role: "user" | "assistant";
};
