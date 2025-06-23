import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChatBubble from 'components/ui/ChatBubble'
import IconButton from 'components/ui/IconButton'
import useLoading from 'hooks/useLoading'
import { LuSend } from 'react-icons/lu'
import { MdAttachFile } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import { ChatContainer } from 'styles/Common'

function History () {
  const { initial, id } = useParams()
  // console.log('History', initial, id);
  
  const { newQuestion, clearNewQuestion, currentSessionId, createSession, addMessage, history } = useHistoryStore()
  
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState(null)

  const isFirstRender = useRef(true) // 최초 렌더링 체크
  const bufferRef = useRef('') // 실시간으로 누적되는 답변 버퍼
  // const intervalRef = useRef(null) // 주기적 렌더링 타이머
  const bottomRef = useRef(null)

  // 📍 custom hook 사용
  const { isLoading, activeLoading, deactiveLoading } = useLoading()

  useEffect(() => {
    if (isFirstRender.current && parseInt(initial || '', 0) && newQuestion) {
      setQuestion(newQuestion)
      handleAsk(newQuestion)
      // clearNewQuestion()
      isFirstRender.current = false
    }
  }, [newQuestion, initial])

  const chatMessages = useMemo(() => {
    const target = history?.[id]?.messages
    if (target && Array.isArray(target)) {
      const sorted = [...target].sort((a, b) => a.createdAt - b.createdAt)
      return sorted
    }
    return []
  }, [history, id])

  // useEffect(() => {
  //   intervalRef.current = setInterval(() => {
  //     if (bufferRef.current !== answer) {
  //       setAnswer(bufferRef.current) // 리렌더링
  //     }
  //   }, 100)

  //   return () => {if (intervalRef.current) clearInterval(intervalRef.current)}
  // }, [])

  const handleAsk = async () => {
    const questionCopy = newQuestion || question
    if (isLoading) return
    if (questionCopy.trim() === '') return

    activeLoading()
    bufferRef.current = ''
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" }) 

    fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: questionCopy }),
    })
    .then(async (response) => {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const res = decoder.decode(value, { stream: true })
            bufferRef.current += res

            setAnswer(bufferRef.current)
        }
        deactiveLoading()

        if (newQuestion) {
          createSession(id, questionCopy, bufferRef.current)
          clearNewQuestion()
        } else {
          addMessage(id, questionCopy, bufferRef.current)
        }
    })
    .catch(err => {
      setAnswer('에러 발생: ' + err.message)
    })
    .finally(() => {
      setAnswer(null)
      setQuestion(null)
    })
  }

  return (
    <ChatContainer style={{overflowY: "auto"}}>
      <div id="content">
          {chatMessages?.map((item, i) => <ChatBubble key={i} data={item} />)}
          {isLoading && <ChatBubble data={{question: question, answer: ''}} />}
          {answer && <ChatBubble data={{question: '', answer: answer}} />}
      </div>

      <div id="question" tabIndex={0} style={{position: 'sticky', bottom: '2rem'}}>
          <IconButton size={20} onClick={handleAsk}><MdAttachFile /></IconButton>
          <input
            placeholder='질문을 입력하세요'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {if (e.key === 'Enter') handleAsk(e)}}
          />
          <IconButton size={20} onClick={handleAsk}><LuSend /></IconButton>
      </div>

      <div className="this" ref={bottomRef} />
    </ChatContainer>
  )
}

export default History