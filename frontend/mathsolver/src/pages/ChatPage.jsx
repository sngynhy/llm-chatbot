import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import ChatLayout from 'components/chat/ChatLayout'
import ChatHeader from 'components/chat/ChatHeader'
import { ChatMessages } from 'components/chat/ChatMessages'
import { ChatInputArea } from 'components/chat/ChatInputArea'
import { askQuestionApi, askWithImageApi } from 'api/askApi'
import { useAskQuestion } from 'hooks/useAskQuestion'

function ChatPage ({ isNewChat }) {
    const { initial, id } = useParams()

    const { newQuestion, setNewQuestion, setCurrentSessionId, clearNewQuestion,
        currentSessionId, createSession, addMessage, history } = useHistoryStore()
    
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState(null)
    const [isLatex, setisLatex] = useState(false)
    // const [extractedText, setExtractedText] = useState('')

    const navigate = useNavigate()

    const isFirstRender = useRef(true) // 최초 렌더링 체크
    const inputRef = useRef(null)
    const chatRef = useRef(null)
    // const intervalRef = useRef(null) // 주기적 렌더링 타이머

    const { isLoading, answer, askWithText, askWithFile, abort } = useAskQuestion({
        onMessageSaved: (id, question, answer, isLatex) => {
            if (newQuestion) {
                createSession(id, question, answer, isLatex)
                clearNewQuestion()
            } else {
                addMessage(id, question, answer, isLatex)
            }
        }
    })

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

    const scrollToBttom = () => {
        chatRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'end',
        })
    }

    const askQuestion = async (e) => {

        if (file) return askWithImage(e)
            
        const questionCopy = newQuestion || question
        if (!questionCopy.trim()) return inputRef.current.focus()

        await askWithText(questionCopy, id, !!newQuestion, scrollToBttom)

        setQuestion('')
        setisLatex(false)
    }

    const askWithImage = async (e) => {
        e.preventDefault()

        await askWithFile(file, id, !!newQuestion, scrollToBttom)

        // 파일 선택 초기화 (동일 파일 재선택 허용)
        e.target.value = null
        setFile(null)
        setisLatex(true)
    }

  return (
    <ChatLayout isNewChat={isNewChat}>

        {isNewChat
            ? <ChatHeader />
            : <ChatMessages
                ref={chatRef}
                messages={chatMessages}
                isLoading={isLoading}
                question={question}
                answer={answer}
                isLatex={isLatex}
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
            onFileSubmit={isNewChat ? askNewQuestion : askWithImage}
            cancelSubmit={abort}
            inputRef={inputRef}
        />

    </ChatLayout>
  )
}

export default ChatPage