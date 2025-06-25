import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import ChatLayout from 'components/chat/ChatLayout'
import ChatHeader from 'components/chat/ChatHeader'
import ChatMessages from 'components/chat/ChatMessages'
import { ChatInputArea } from 'components/chat/ChatInputArea'
import { askQuestionApi, askWithImageApi } from 'api/askApi'

function ChatPage ({ isNewChat }) {
    const { initial, id } = useParams()

    const { newQuestion, setNewQuestion, setCurrentSessionId, clearNewQuestion,
        currentSessionId, createSession, addMessage, history } = useHistoryStore()
    
    const [isLoading, setIsLoading] = useState(false)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [file, setFile] = useState(null)
    const [extractedText, setExtractedText] = useState('')

    const navigate = useNavigate()

    const isFirstRender = useRef(true) // 최초 렌더링 체크
    const bufferRef = useRef('') // 실시간으로 누적되는 답변 버퍼
    const inputRef = useRef(null)
    const bottomRef = useRef(null)
    // const intervalRef = useRef(null) // 주기적 렌더링 타이머


    useEffect(() => {
        if (isFirstRender.current && parseInt(initial || '', 0) && newQuestion) {
            setQuestion(newQuestion)
            askQuestion()
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

    const askNewQuestion = (e) => {
        const question = e.target.value
        
        if (file) return askWithImage(e)
        if (question === undefined) return inputRef.current.focus()

        setNewQuestion(question)
        const sessionId = new Date().getTime()
        setCurrentSessionId(sessionId.toString())
        navigate(`/history/1/${sessionId}`)
    }

    const askQuestion = async (e) => {
        const questionCopy = newQuestion || question
        if (file) return askWithImage(e)
        if (isLoading || questionCopy.trim() === '') return

        setIsLoading(true)
        bufferRef.current = ''
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" })

        try {
            const response = await askQuestionApi(question)
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
        } catch (err) {
            console.error(err)
            setAnswer('에러 발생: ' + err.message)
        } finally {
            setAnswer('')
            setQuestion('')
        }
    }

    const askWithImage = async (e) => {
        e.preventDefault()

        if (!file) return

        setIsLoading(true)

        try {
            const response = await askWithImageApi(file)
            if (!response) throw new Error('Server Error')

            setFile(null)
            
            // 파일 선택 초기화 (동일 파일 재선택 허용)
            e.target.value = null
            
            const data = await response.json()
            setExtractedText(data.text)

        } catch(err) {
            console.error(err)
            setAnswer('에러 발생: ' + err.message)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <ChatLayout isNewChat={isNewChat}>

        {isNewChat
            ? <ChatHeader />
            : <ChatMessages
                messages={chatMessages}
                isLoading={isLoading}
                question={question}
                answer={answer}
            />
        }

        <ChatInputArea
            isNewChat={isNewChat}
            isLoading={isLoading}
            file={file}
            setFile={setFile}
            question={question}
            setQuestion={setQuestion}
            onSubmit={isNewChat ? askNewQuestion : askQuestion}
            onFileSubmit={askWithImage}
            inputRef={inputRef}
        />

        {/* <div className="this" ref={bottomRef} /> */}
    </ChatLayout>
  )
}

export default ChatPage