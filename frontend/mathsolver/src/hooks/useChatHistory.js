import { useState, useMemo, useCallback } from "react";
import { deleteChat, fetchChat, fetchChatTitles } from "api/chatApi";
import { useHistoryStore } from "stores/useHistoryStore";
import { useNavigate } from "react-router-dom";

export function useChatHistory() {
  const [isLoading, setIsLoading] = useState({
    titles: false,
    chatMessages: false,
    remove: false,
  });
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const { setChatTitles, removeTitle } = useHistoryStore();

  const navigate = useNavigate();

  const getChatTitles = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, titles: true }));
      const res = await fetchChatTitles();
      setChatTitles(res);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading((prev) => ({ ...prev, titles: false }));
    }
  }, [setChatTitles]);

  const getChatMessages = useCallback(
    async (chatId) => {
      try {
        setIsLoading((prev) => ({ ...prev, chatMessages: true }));
        const res = await fetchChat(chatId);
        setChatMessages(res);
        setError(null);
        return res;
      } catch (err) {
        setError(err);
        if (err.status === 404) navigate("/");
      } finally {
        setIsLoading((prev) => ({ ...prev, chatMessages: false }));
      }
    },
    [navigate]
  );

  const removeChat = useCallback(
    async (chatId) => {
      try {
        setIsLoading((prev) => ({ ...prev, remove: true }));
        await deleteChat(chatId);
        removeTitle(chatId);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading((prev) => ({ ...prev, remove: false }));
      }
    },
    [removeTitle]
  );

  const actions = useMemo(
    () => ({
      getChatTitles,
      getChatMessages,
      removeChat,
    }),
    [getChatMessages, getChatTitles, removeChat]
  );

  return {
    data: { chatMessages },
    actions: actions,
    isLoading,
    error,
  };
}
