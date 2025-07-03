import React, { forwardRef } from 'react';
import ChatBubble from "components/chat/ChatBubble";

// forwardRef : ref을 전달하여 상위 DOM을 하위 컴포넌트에서 조작
export const ChatMessages = forwardRef(({ messages, isLoading, question, answer, isLatex }, ref) => {
    return (
      <div id="chat" style={{ marginBottom: isLoading ? '40rem' : '2rem', minHeight: '46rem' }}>
        {messages.map((item, i) => <ChatBubble key={i} data={item} />)}
        {isLoading && <ChatBubble data={{ question: question, answer: '', isLatex: isLatex }} />}
        {answer && <ChatBubble data={{ question: '', answer }} />}

        <div ref={ref} style={{ height: isLoading ? '30rem' : 0 }}></div>
      </div>
    )
})