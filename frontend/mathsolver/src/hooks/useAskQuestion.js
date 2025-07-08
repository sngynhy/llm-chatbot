import { useState, useRef } from 'react'
import { askQuestionApi, askWithImageApi } from "api/askApi";
import { fetchTextAnswer } from 'utils/fetchAsk';

// 질문 받아서 처리
export function useAskQuestion({ onMessageSaved }) {
    const [isLoading, setIsLoading] = useState(false)
    const [answer, setAnswer] = useState('')
    const controllerRef = useRef(null)
    const bufferRef = useRef('')

    const askWithText = async (question, sessionId, onBeforeStart) => {
        if (!question.trim()) return

        setIsLoading(true)
        bufferRef.current = ''

        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal

        try {
            onBeforeStart?.()

            await fetchTextAnswer(question, signal, (chunk) => {
                bufferRef.current += chunk
                setAnswer(bufferRef.current)
            })

            onMessageSaved?.(sessionId, question, bufferRef.current, false)
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('요청이 취소되었습니다.');
            } else {
                console.log('요청 실패:', err);
                setAnswer('죄송합니다. 문제가 발생하였습니다.\n잠시 후 다시 시도해주세요.')
            }
        } finally {
            setIsLoading(false)
            setAnswer('')
        }
    }

    const askWithFile = async (file, sessionId, onBeforeStart) => {
        if (!file) return

        setIsLoading(true)
        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal

        try {
            onBeforeStart?.()

            const response = await askWithImageApi(file, signal)
            if (!response.ok) throw new Error('Server Error')
            
            const data = await response.json()
            const { latex, answer } = data

            onMessageSaved?.(sessionId, latex, answer, true)
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('요청이 취소되었습니다.');
            } else {
                console.log('요청 실패:', err);
                setAnswer('죄송합니다. 문제가 발생하였습니다.\n잠시 후 다시 시도해주세요.')
            }
        } finally {
            setIsLoading(false)
            setAnswer('')
        }
    }

    const abort = () => controllerRef.current?.abort()

    return { isLoading, answer, askWithText, askWithFile, abort }
}