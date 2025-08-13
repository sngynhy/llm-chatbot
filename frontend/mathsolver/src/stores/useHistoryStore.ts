// src/store/useHistoryStore.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { NewQuestion, ChatTitle, HistoryState } from "types/store";

export const useHistoryStore = create(
  devtools<HistoryState>(
    (set, get) => ({
      currentchatId: null,
      setCurrentchatId: (chatId: string | null) =>
        set({ currentchatId: chatId }),

      requestchatId: null,
      setRequestchatId: (chatId: string | null) =>
        set({ requestchatId: chatId }),

      newQuestion: null,
      setNewQuestion: (question: NewQuestion) => set({ newQuestion: question }),
      clearNewQuestion: () => set({ newQuestion: null }),

      chatIds: [],
      chatTitles: [],
      setChatTitles: (titles: ChatTitle[]) =>
        set((state) => ({
          chatIds: titles.map((el) => el.chatId),
          chatTitles: titles,
          // chatTitles: [...titles, ...titles, ...titles, ...titles, ...titles],
        })),
      addChatId: (chatId: string) =>
        set((state) => ({ chatIds: [...state.chatIds, chatId] })),
      addChatTitle: (title: ChatTitle) =>
        set((state) => ({
          chatTitles: [...state.chatTitles, title].sort((a, b) =>
            b.chatId.localeCompare(a.chatId)
          ),
        })),
      removeTitle: (chatId: string) =>
        set((state) => ({
          chatIds: state.chatIds.filter((el) => el !== chatId),
          chatTitles: state.chatTitles.filter((el) => el.chatId !== chatId),
          currentchatId:
            state.currentchatId === chatId ? null : state.currentchatId,
        })),
    }),
    {
      name: "chat-history-store",
    }
  )
);
