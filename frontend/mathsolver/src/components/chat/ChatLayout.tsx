import React, { forwardRef } from "react";
import { ChatContainer } from "styles/Common";

interface ChatLayoutProps {
  isNewChat: boolean;
  chatId: string;
  children: React.ReactNode;
}
// forwardRef : ref을 전달하여 상위 DOM을 하위 컴포넌트에서 조작
export const ChatLayout = forwardRef<HTMLDivElement, ChatLayoutProps>(
  ({ isNewChat, chatId, children }, ref) => {
    return (
      <ChatContainer ref={ref} id="chat-container" $isNewChat={isNewChat}>
        {children}
      </ChatContainer>
    );
  }
);
