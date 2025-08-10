import React from "react";
import ChatBubble from "components/chat/ChatBubble";
import { ChatMessage, ChatState } from "types/reducer";

interface ChatMessagesProps {
  messages: ChatState[string];
  isStreaming: boolean;
  assistant: string;
  isLatex: boolean;
  currentchatId: string;
  requestchatId: string;
}

export const ChatMessages = ({
  messages,
  isStreaming,
  assistant,
  isLatex,
  currentchatId,
  requestchatId,
}: ChatMessagesProps) => {
  // console.log("ChatMessages", messages);
  return (
    <div id="chat" style={{ minHeight: "calc(100vh - 10rem)" }}>
      {messages.map((msg: ChatMessage, i: number) => (
        <ChatBubble key={i} message={msg} />
      ))}

      {currentchatId === requestchatId && isStreaming && assistant && (
        <div>
          <ChatBubble
            message={{
              content: assistant,
              role: "assistant",
              isLatex,
            }}
          />
        </div>
      )}
    </div>
  );
};
