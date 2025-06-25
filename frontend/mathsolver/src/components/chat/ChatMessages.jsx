import ChatBubble from "components/chat/ChatBubble";

export default function ChatMessages({ messages, isLoading, question, answer }) {
    return (
      <div id="content" style={{ marginBottom: '1rem' }}>
        {messages.map((item, i) => <ChatBubble key={i} data={item} />)}
        {isLoading && <ChatBubble data={{ question: question, answer: '' }} />}
        {answer && <ChatBubble data={{ question: '', answer }} />}
      </div>
    )
  }