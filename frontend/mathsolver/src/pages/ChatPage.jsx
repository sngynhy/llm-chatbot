import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHistoryStore } from 'stores/useHistoryStore'
import ChatLayout from 'components/chat/ChatLayout'
import ChatHeader from 'components/chat/ChatHeader'
import { ChatMessages } from 'components/chat/ChatMessages'
import { ChatInputArea } from 'components/chat/ChatInputArea'
import { useAskQuestion } from 'hooks/useAskQuestion'
import { useChatHistory } from 'hooks/useChatHistory'
import { actionType, chatReducer } from 'reducers/chatReducer'

function ChatPage ({ isNewChat }) {
    const { initialAsk, chatId } = useParams()
    const navigate = useNavigate()

    const { newQuestion, setNewQuestion, clearNewQuestion,
        currentchatId, setCurrentchatId, requestchatId, setRequestchatId } = useHistoryStore()
    
    const [streamMessages, dispatch] = useReducer(chatReducer, [])
    
    const [question, setQuestion] = useState('')
    const [file, setFile] = useState(null)
    const [isLatex, setIsLatex] = useState(false)

    const isFirstRender = useRef(true) // 최초 렌더링 체크
    const inputRef = useRef(null)

    const { data, actions } = useChatHistory()

    useEffect(() => {
        // 질문 내역 페이지일 경우 채팅 메시지 목록 가져오기
        if (chatId && !parseInt(initialAsk)) actions.getChatMessages(chatId)

        return () => dispatch({type: actionType.resetMessage}) // reducer에 저장된 실시간 메세지 데이터 제거
    }, [actions, chatId, initialAsk])

    useEffect(() => {
        if (isNewChat) setCurrentchatId(null)
        // 새 채팅 페이지에서 넘어온 경우 아래 코드 실행
        else if (isFirstRender.current && !isNewChat && Number(initialAsk) && newQuestion) {
            newQuestion.type === 'text' ? setQuestion(newQuestion.value) : setFile(newQuestion.value)
            newQuestion.type === 'text' ? askQuestion() : askWithImage()
            isFirstRender.current = false
        }
    }, [newQuestion, initialAsk, isNewChat])

    const { isLoading, assistant, askWithText, askWithFile, abort } = useAskQuestion({
        onMessageSaved: (chatId, question, assistant, isLatex) => {
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

    const chatMessages = useMemo(() => {
        const target = data.chatMessages?.messages
        if (target && Array.isArray(target)) {
            const sorted = [...target].sort((a, b) => a.createdAt - b.createdAt)
            return sorted
        }
        return []
    }, [data.chatMessages])

    // const mergedMessages = useMemo(() => {
    //     console.log('mergedMessages', );
    //     return [...chatMessages, ...streamMessages].sort(
    //     (a, b) => a.createdAt - b.createdAt
    // );
    // }, [chatMessages, streamMessages])

    const askNewQuestion = () => {
        console.log('askNewQuestion', question);
        
        if (!file && question === undefined) return inputRef.current.focus()

        const param = { type: !file ? 'text' : 'file', value: !file ? question : file }
        setNewQuestion(param)
        const chatId = Date.now()
        setCurrentchatId(chatId)
        navigate(`/chat/1/${chatId}`)
    }

    const askQuestion = async () => {
        console.log('✨askQuestion', );
            
        const questionCopy = newQuestion?.value || question
        if (!questionCopy.trim()) return inputRef.current.focus()

        await askWithText(questionCopy, chatId, () => {
            setRequestchatId(chatId)
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
        <ChatLayout isNewChat={isNewChat} chatId={chatId}>

            {isNewChat
                ? <ChatHeader />
                : <ChatMessages
                    isLoading={isLoading}
                    messages={[...chatMessages, ...streamMessages]}
                    assistant={assistant}
                    isLatex={isLatex}
                    currentchatId={currentchatId}
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