// src/store/useHistoryStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useHistoryStore = create(
  persist(
    (set) => ({
      /**
       {
          "1111": {
            id: "1111",
            title: "리액트란?",
            messages: [
              { qusetion: "질문1", answer: "답변1", createdAt: 1710000000000 },
              { qusetion: "질문2", answer: "답변2", createdAt: 1710000000000 },
            ]
          },
          ...
        }
       */
      
      history: {},
      currentSessionId: null,
      setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
      createSession: (sessionId, initialQ, initialA) => {
        const date = Date.now()
        const newSession = {
          sessionId,
          title: initialQ.slice(0, 18) || 'New Chat', // 추후 python으로 내용 요약 구현 후 수정
          messages: [{ question: initialQ, answer: initialA, createdAt: date }]
        }
        set(state => ({
          history: { ...state.history, [sessionId]: newSession },
          currentSessionId: sessionId
        }))
      },
      addMessage: (sessionId, question, answer) => {set(state => {
        const session = state.history[sessionId]
        if (!session) return state

        const createdAt = Date.now()

        return {
          history: {
            ...state.history,
            [sessionId]: {
              ...session,
              messages: [...session.messages, { question, answer, createdAt }]
            }
          }
        }
      })},
      deleteSession: id => {set(state => {
        const newHistory = { ...state.history }
        delete newHistory[id]
        return {
          history: newHistory,
          currentSessionId: state.currentSessionId === id ? null : state.currentSessionId
        }
      })},
      clearHistory: () => set({ history: {}, currentSessionId: null }),

      newQuestion: null,
      setNewQuestion: value => set({ newQuestion: value }),
      clearNewQuestion: () => set({ newQuestion: null })
    }),
    {
      name: 'math-question-history', // localStorage key
    }
  )
)