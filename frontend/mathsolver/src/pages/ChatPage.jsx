import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import ChatLayout from 'components/chat/ChatLayout'
import ChatHeader from 'components/chat/ChatHeader'
import { ChatMessages } from 'components/chat/ChatMessages'
import { ChatInputArea } from 'components/chat/ChatInputArea'
import { useAskQuestion } from 'hooks/useAskQuestion'

function ChatPage ({ isNewChat }) {
    const { initialAsk, sessionId } = useParams()

    const { newQuestion, setNewQuestion, clearNewQuestion,
        currentSessionId, setCurrentSessionId,
        createSession, addMessage, history } = useHistoryStore()
    
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState(null)
    const [isLatex, setisLatex] = useState(false)

    const navigate = useNavigate()

    const isFirstRender = useRef(true) // 최초 렌더링 체크
    const inputRef = useRef(null)
    const chatRef = useRef(null)

    const { isLoading, answer, askWithText, askWithFile, abort } = useAskQuestion({
        onMessageSaved: (sessionId, question, answer, isLatex) => {
            if (newQuestion) {
                createSession(sessionId, question, answer, isLatex)
                clearNewQuestion()
            } else {
                addMessage(sessionId, question, answer, isLatex)
            }
        }
    })

    useEffect(() => {
        // 새 채팅 페이지에서 넘어온 경우 아래 코드 실행
        if (isFirstRender.current && !isNewChat && Number(initialAsk || '', 0) && newQuestion) {
            newQuestion.type === 'text' ? setQuestion(newQuestion.value) : setFile(newQuestion.value)
            newQuestion.type === 'text' ? askQuestion() : askWithImage()
            isFirstRender.current = false
        }
    }, [newQuestion, initialAsk])

    useEffect(() => {
        isFirstRender.current = true
        scrollToBttom()
    }, [sessionId])

    const chatMessages = useMemo(() => {
        const target = history?.[sessionId]?.messages
        if (target && Array.isArray(target)) {
            const sorted = [...target].sort((a, b) => a.createdAt - b.createdAt)
            return sorted
        }
        return []
    }, [history, sessionId])

    const askNewQuestion = () => {
        // console.log('askNewQuestion', question);
        
        if (!file && question === undefined) return inputRef.current.focus()

        const param = { type: !file ? 'text' : 'file', value: !file ? question : file }  
        setNewQuestion(param)
        const sessionId = new Date().getTime()
        setCurrentSessionId(sessionId.toString())
        navigate(`/history/1/${sessionId}`)
    }

    const scrollToBttom = () => {
        console.log('scrollToBttom', chatRef.current);
        chatRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'end',
        })
    }

    const askQuestion = async () => {
        // console.log('✨askQuestion', );
            
        const questionCopy = newQuestion?.value || question
        if (!questionCopy.trim()) return inputRef.current.focus()

        await askWithText(questionCopy, sessionId, scrollToBttom)

        setQuestion('')
        setisLatex(false)
    }

    const askWithImage = async () => {
        // console.log('🎞askWithImage', );

        const fileCopy = newQuestion?.value || file

        await askWithFile(fileCopy, sessionId, scrollToBttom)
        
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