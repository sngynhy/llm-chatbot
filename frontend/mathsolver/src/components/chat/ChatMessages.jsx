import React from 'react';
import ChatBubble from "components/chat/ChatBubble";

// forwardRef : ref을 전달하여 상위 DOM을 하위 컴포넌트에서 조작
export const ChatMessages = ({ messages, isLoading, assistant, isLatex, currentchatId, requestchatId }) => {
    return (
      <div id="chat" style={{ minHeight: '46rem' }}>
        {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}

        {currentchatId === requestchatId && isLoading && assistant &&
          <ChatBubble message={{ content: assistant, role: 'assistant', isLatex }} />
        }
      </div>
    )
}