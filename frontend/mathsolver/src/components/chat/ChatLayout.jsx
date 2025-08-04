import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { IconButton } from "components/ui/IconButton";
import { GoMoveToBottom } from "react-icons/go";
import { ChatContainer } from "styles/Common";

export const ChatLayout = forwardRef(({ isNewChat, chatId, children }, ref) => {
  // console.log('ChatLayout', isNewChat, chatId, children);
  const chatRef = useRef(null)
  const scrollToBottom = () => {
      chatRef.current?.scrollIntoView({
          behavior: 'smooth', // 'instant',
          block: 'end',
      })
  }
  // 부모에서 사용할 수 있도록 scrollToBottom 노출
  useImperativeHandle(ref, () => ({
      scrollToBottom,
  }))
  // useEffect(() => {
  //   if (!isNewChat) scrollToBottom()
  // }, [chatId])

  return (
    <ChatContainer id="chat-container" $isNewChat={isNewChat}>
      {children}
      <div ref={chatRef}></div>
      {/* {!isNewChat && <div style={{position: 'sticky', bottom: 0}}>
        <IconButton><GoMoveToBottom onClick={scrollToBottom}/></IconButton>
      </div>} */}
    </ChatContainer>
  )
})