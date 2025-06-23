import React from 'react'
import ChatBubble from './ChatBubble'

function ChatWindow ({ data }) {
   return (
        <div style={{ padding: '20px', height: '80vh', overflowY: 'auto', background: '#fff' }}>
            {data.map((item, i) => <ChatBubble key={i} data={item} />)}
        </div>
    )
}

export default ChatWindow
