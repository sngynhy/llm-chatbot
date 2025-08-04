import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import { ChatLayout } from 'components/chat/ChatLayout'
import { ChatHeader } from 'components/chat/ChatHeader'
import { ChatMessages } from 'components/chat/ChatMessages'
import { ChatInputArea } from 'components/chat/ChatInputArea'
import { useAskQuestion } from 'hooks/useAskQuestion'
import { useChatHistory } from 'hooks/useChatHistory'
import { actionType, chatReducer } from 'reducers/chatReducer'

function ChatPage ({ isNewChat }) {
    const { chatId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { initialAsk } = location.state || false

    const { newQuestion, setNewQuestion, clearNewQuestion,
        currentchatId, setCurrentchatId, requestchatId, setRequestchatId } = useHistoryStore()
    
    const [streamMessages, dispatch] = useReducer(chatReducer, [])
    
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState(null)
    const [isLatex, setIsLatex] = useState(false)
    const [chatMessages, setChatMessages] = useState([])
    
    const isFirstRender = useRef(true) // 최초 렌더링 체크
    const inputRef = useRef(null)
    const layoutRef = useRef(null)

    const { actions } = useChatHistory()
    const { isLoading, assistant, askWithText, askWithFile, abort } = useAskQuestion({
        onMessageSaved: (chatId, question, assistant, isLatex) => {
            // reducer에 실시간 응답 저장
            dispatch({
                type: actionType.addMessage,
                payload: {
                    chatId: chatId,
                    content: assistant,
                    role: 'assistant',
                    isLatex: isLatex
                }
            })
            if (newQuestion) clearNewQuestion()
        }
    })

    const getChat = useCallback(async () => {
        const res = await actions.getChatMessages(chatId)
        const messages = res.messages
        if (Array.isArray(messages)) setChatMessages(messages)
    }, [chatId, actions])

    useEffect(() => {
        // chatId 변경 감지
        if (currentchatId !== chatId) setCurrentchatId(chatId)
        return () => {
            if (chatId) dispatch({type: actionType.resetMessage}) // unmount 시 reducer에 저장된 실시간 메세지 초기화
        }
    }, [chatId])

    useEffect(() => {
        // 질문 내역 페이지일 경우 채팅 메시지 가져오기
        if (!isNewChat && !initialAsk) getChat()
    }, [isNewChat, initialAsk, getChat])

    useEffect(() => {
        // 새 질문 페이지일 경우
        if (isNewChat) {
            if (currentchatId !== null) setCurrentchatId(null)
            if (chatMessages.length > 0) setChatMessages([])
            return
        }
        
        // 새 질문 페이지에서 넘어온 경우 질문 전송
        if (initialAsk && isFirstRender.current) {
            if (!newQuestion) {
                navigate('/')
                return
            }

            const { type, value } = newQuestion
            if (type === 'text') {
                setQuestion(value)
                askQuestion()
            } else {
                setFile(value)
                askWithImage()
            }
            isFirstRender.current = false
        }

    }, [newQuestion, initialAsk, isNewChat])

    const askNewQuestion = () => {
        // console.log('🎃 askNewQuestion', question);
        
        if (!file && question === undefined) return inputRef.current.focus()

        const param = { type: !file ? 'text' : 'file', value: !file ? question : file }
        setNewQuestion(param)
        const chatId = Date.now()
        setCurrentchatId(chatId)
        navigate(`/chat/${chatId}`, { state: { initialAsk: true }})
    }

    const askQuestion = async () => {
        
        const questionCopy = newQuestion?.value || question
        if (!questionCopy.trim()) return inputRef.current.focus()
            
        // console.log('✨askQuestion', questionCopy);
        await askWithText(questionCopy, chatId, initialAsk, () => {
            setRequestchatId(chatId)
            // reducer에 실시간 질문 저장
            dispatch({
                type: actionType.addMessage,
                payload: {
                    chatId: chatId,
                    content: questionCopy,
                    role: 'user'
                }
            })
        })

        setQuestion('')
        setIsLatex(false)
    }

    const askWithImage = async () => {
        // console.log('🎞askWithImage', );

        const fileCopy = newQuestion?.value || file

        await askWithFile(fileCopy, chatId, () => setRequestchatId(chatId))
        
        setFile(null)
        setIsLatex(true)
    }

    return (
        <ChatLayout isNewChat={isNewChat} chatId={chatId} ref={layoutRef}>

            {isNewChat
                ? <ChatHeader />
                : <ChatMessages
                    isLoading={isLoading}
                    messages={[...chatMessages, ...streamMessages]}
                    assistant={assistant}
                    isLatex={isLatex}
                    currentchatId={chatId}
                    requestchatId={requestchatId}
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