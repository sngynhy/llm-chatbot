// src/store/useHistoryStore.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export const useHistoryStore = create(
  // persist(
  devtools(
    (set, get) => ({
      currentchatId: null,
      setCurrentchatId: (chatId) => set({ currentchatId: chatId }),
      
      requestchatId: null,
      setRequestchatId: (chatId) => set({ requestchatId: chatId }),
      
      newQuestion: null, // { type: 'text OR file', value: ''}
      setNewQuestion: (param) => set({ newQuestion: { type: param.type, value: param.value } }),
      clearNewQuestion: () => set({ newQuestion: null }),

      chatIds: [],
      chatTitles: [],
      setChatTitles: titles => set((state) => {
        return {
          chatIds: titles.map(el => el.chatId),
          chatTitles: titles
        }
      }),
      addChatId: id => set((state) => ({ chatIds: [...state.chatIds, id]})),
      addChatTitle: title => set((state) => ({ chatTitles: [...state.chatTitles, title].sort((a, b) => b.chatId.localeCompare(a.chatId))})),
      removeTitle: id => set((state) => {
        return {
          chatIds: state.chatIds.filter(el => el !== id),
          chatTitles: state.chatTitles.filter(el => el.chatId !== id),
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId
        }
      })
    }),
    {
      name: 'chat-history-store',
    }
  )
)