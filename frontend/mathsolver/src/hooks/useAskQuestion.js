import { useState, useRef } from 'react'
import { askWithImageApi } from "api/askApi";
import { fetchTextAnswer } from 'utils/fetchAsk';

// 질문 받아서 처리
export function useAskQuestion({ onMessageSaved }) {
    const [isLoading, setIsLoading] = useState(false)
    // const [loadingMap, setIsLoading] = useState(new Map())
    const [error, setError] = useState('')
    const [assistant, setAssistant] = useState('')
    const controllerRef = useRef(null)
    const bufferRef = useRef('')

    const askWithText = async (question, chatId, onBeforeStart) => {
        if (!question.trim()) return

        setIsLoading(true)
        bufferRef.current = ''

        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal

        try {
            onBeforeStart?.()

            const data = {
                chatId: chatId,
                question: question,
                title: question.slice(0, 18) || 'New Chat',
                titleIsLatex: false,
            }
            await fetchTextAnswer(data, signal, (chunk) => {
                bufferRef.current += chunk
                setAssistant(bufferRef.current)
            })

            onMessageSaved?.(chatId, question, bufferRef.current, false)
        } catch (err) {
            if (err.name === 'AbortError') {
                // console.log('요청 취소');
                onMessageSaved?.(chatId, question, bufferRef.current, false)
            } else {
                console.log('요청 실패:', err);
                setError('죄송합니다. 문제가 발생하였습니다.\n잠시 후 다시 시도해주세요.')
            }
        } finally {
            setIsLoading(false)
            setAssistant('')
        }
    }

    const askWithFile = async (file, chatId, onBeforeStart) => {
        if (!file) return

        setIsLoading(true)
        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal

        try {
            onBeforeStart?.()

            const response = await askWithImageApi(file, signal)
            if (!response.ok) throw new Error('Server Error')
            
            const data = await response.json()
            const { latex, assistant } = data

            onMessageSaved?.(chatId, latex, assistant, true)
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('요청이 취소되었습니다.');
            } else {
                console.log('요청 실패:', err);
                setError('죄송합니다. 문제가 발생하였습니다.\n잠시 후 다시 시도해주세요.')
            }
        } finally {
            setIsLoading(false)
            setAssistant('')
        }
    }

    const abort = () => controllerRef.current?.abort()

    return { isLoading, assistant, askWithText, askWithFile, abort }
}