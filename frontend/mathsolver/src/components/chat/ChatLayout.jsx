import { ChatContainer } from "styles/Common";

export default function ChatLayout({ isNewChat, children }) {
  return (
    <ChatContainer style={isNewChat ? { overflowY: "auto" } : { justifyContent: 'center' }}>
      {children}
    </ChatContainer>
  )
}