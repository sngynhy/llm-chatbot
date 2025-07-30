import { useState, useMemo, useCallback } from 'react'
import { deleteChat, fetchChat, fetchChatTitles } from "api/chatApi";
import { useHistoryStore } from 'stores/useHistoryStore';

export const useChatHistory = () => {
    const [isLoading, setIsLoading] = useState({
        titles: false,
        chatMessages: false,
        remove: false
    })
    const [error, setError] = useState()
    // const [chatTitles, setChatTitles] = useState([])
    const [chatMessages, setChatMessages] = useState([])
    const { setChatTitles, removeTitle } = useHistoryStore()

    const getChatTitles = useCallback(async () => {
        try {
            setIsLoading(prev => ({...prev, titles: true}))
            const res = await fetchChatTitles()
            setChatTitles(res)
        } catch (err) {
            setError(err)
        } finally {
            setIsLoading(prev => ({...prev, titles: false}))
        }
    }, [setChatTitles])

    const getChatMessages = useCallback(async (chatId) => {
        try {
            setIsLoading(prev => ({ ...prev, chat: true }))
            const res = await fetchChat(chatId)
            setChatMessages(res)
        } catch (err) {
            setError(err)
        } finally {
            setIsLoading(prev => ({ ...prev, chat: false }))
        }
    }, [])

    const removeChat = useCallback(async (chatId) => {
        try {
            setIsLoading(prev => ({ ...prev, remove: true }))
            const res = await deleteChat(chatId)
            console.log('deleteChat', res);
            removeTitle(chatId)
        } catch (err) {
            setError(err)
        } finally {
            setIsLoading(prev => ({ ...prev, remove: false }))
        }
    }, [removeTitle])

    const actions = useMemo(() => ({
        getChatTitles,
        getChatMessages,
        removeChat
    }), [getChatMessages, getChatTitles, removeChat])

    return {
        data: { chatMessages },
        actions: actions,
        isLoading,
        error
    }
}
