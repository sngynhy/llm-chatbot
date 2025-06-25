import React, { useEffect, useMemo, useRef, useState } from 'react'
import ChatBubble from 'components/chat/ChatBubble'
import IconButton from 'components/ui/IconButton'
import { LuSend } from 'react-icons/lu'
import { MdAttachFile } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import { ChatContainer } from 'styles/Common'
import { ScaleLoader } from "react-spinners";
import { CgMathPlus } from 'react-icons/cg'

function History () {
  const { initial, id } = useParams()
  // console.log('History', initial, id);
  
  const { newQuestion, clearNewQuestion, currentSessionId, createSession, addMessage, history } = useHistoryStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')

  const isFirstRender = useRef(true) // 최초 렌더링 체크
  const bufferRef = useRef('') // 실시간으로 누적되는 답변 버퍼
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  // const intervalRef = useRef(null) // 주기적 렌더링 타이머


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

  const handleAsk = async (e) => {
    const questionCopy = newQuestion || question
    if (file) return handleSubmit(e)
    if (isLoading || questionCopy.trim() === '') return

    setIsLoading(true)
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
        setIsLoading(false)

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
      setAnswer('')
      setQuestion('')
    })
  }

  const handleFileChange = (e) => {
      console.log('handleFileChange', e.target.files);
      setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
      console.log('handleSubmit', );
      e.preventDefault()

      if (!file) return

      setIsLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      setFile(null)

      try {
          const response = await fetch('/extract-text', {
              method: 'POST',
              body: formData
          })

          if (!response) throw new Error('Server Error')
          
          const data = await response.json()
          setExtractedText(data.text)
      } catch(err) {
          console.error(err)
      } finally {
          setIsLoading(false)
      }
  }

  return (
    <ChatContainer style={{overflowY: "auto"}}>
      <div id="content" style={{marginBottom: '1rem'}}>
          {chatMessages?.map((item, i) => <ChatBubble key={i} data={item} />)}
          {isLoading && <ChatBubble data={{question: question, answer: ''}} />}
          {answer && <ChatBubble data={{question: '', answer: answer}} />}
      </div>

      <div id="question" tabIndex={0} style={{position: 'sticky', bottom: '1rem'}}>

          <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
          <label htmlFor="fileInput" style={{display: "flex"}}><IconButton size={20}><MdAttachFile /></IconButton></label>

          {file
            ? <div id="file">
                <span onClick={() => setFile(null)}>
                    <div>{file.name}</div>
                    <IconButton size={15} color='gray'><CgMathPlus style={{transform: 'rotate(45deg)'}}/></IconButton>
                </span>
            </div>
            : <input
                ref={inputRef}
                value={isLoading ? '' : question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {if (e.key === 'Enter') handleAsk(e)}}
                placeholder='질문을 입력하세요'
                disabled={isLoading}
              />
          }

          {isLoading
            ? <IconButton style={{cursur: 'auto !important'}}><ScaleLoader width={2} height={18} /></IconButton>
            : <IconButton size={20} onClick={handleAsk}><LuSend /></IconButton>}
      </div>

      {/* <div className="this" ref={bottomRef} /> */}
    </ChatContainer>
  )
}

export default History