import React, { useEffect, useRef } from "react";
import IconButton from "components/ui/IconButton";
import { GoMoveToBottom } from "react-icons/go";
import { ChatContainer } from "styles/Common";

export default function ChatLayout({ isNewChat, chatId, children }) {
  const chatRef = useRef(null)
  const scrollToBottom = () => {
      chatRef.current?.scrollIntoView({
          behavior: 'smooth', // 'instant',
          block: 'end',
      })
  }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [chatId])

  return (
    <ChatContainer ref={chatRef} id="chat-container" $isNewChat={isNewChat}>
      {children}
      {/* {!isNewChat && <div style={{position: 'sticky', bottom: 0}}>
        <IconButton><GoMoveToBottom onClick={scrollToBottom}/></IconButton>
      </div>} */}
    </ChatContainer>
  )
}