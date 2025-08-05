import { useReducer, useEffect, useCallback } from "react";
import { actionType, chatReducer } from "reducers/chatReducer";

const STORAGE_KEY = "streaming_messages";

// 로컬 스토리지에 현재 스트리밍중이거나 요청이 취소된 메세지 저장
export function useStreamingStorage() {
  const [streamMessages, dispatch] = useReducer(chatReducer, {});

  // 로컬 스토리지로부터 데이터 로드
  //   useEffect(() => {
  //     try {
  //       const stored = localStorage.getItem(STORAGE_KEY);
  //       if (stored) {
  //         const parsed = JSON.parse(stored);
  //         // 로컬스토리지에 저장된 메시지 복원 > reducer에 저장
  //         Object.entries(parsed).forEach(([chatId, messages]) => {
  //           messages.forEach((message) => {
  //             dispatch({
  //               type: actionType.addMessage,
  //               payload: {
  //                 chatId,
  //                 content: message.content,
  //                 role: message.role,
  //                 isLatex: message.isLatex,
  //               },
  //             });
  //           });
  //         });
  //       }
  //     } catch (error) {
  //       console.warn("로컬스토리지에서 스트리밍 메시지 불러오기 실패:", error);
  //     }
  //   }, []);

  // reducerd에 메시지 추가
  const addMessage = useCallback((chatId, content, role, isLatex = false) => {
    console.log("addMessage", chatId, content, role, isLatex);
    dispatch({
      type: actionType.addMessage,
      payload: { chatId, content, role, isLatex },
    });
  }, []);

  // 특정 chatId 메시지 초기화
  const resetChatMessages = useCallback((chatId) => {
    dispatch({
      type: actionType.resetMessage,
      payload: { chatId },
    });
  }, []);

  // 모든 메시지 초기화
  const resetAllMessages = useCallback(() => {
    dispatch({ type: actionType.resetChatMessages });
  }, []);

  // 로컬 스토리지 동기화 (디바운스 적용)
  // streamMessages에서 현재 스트리밍 중이거나 또는 사용자가 요청을 취소한 메시지만 로컬스토리지에 저장
  //   useEffect(() => {
  //     const timeoutId = setTimeout(() => {
  //       try {
  //         // streamMessages에서 조건에 맞는 메시지만 필터링 (isStreaming 또는 isCancelled)
  //         const filtered = {};
  //         Object.entries(streamMessages).forEach(([chatId, messages]) => {
  //           // isStreaming 또는 isCancelled가 true인 메시지만 저장
  //           const filteredMessages = messages.filter(
  //             (msg, idx) =>
  //               msg.isStreaming === true ||
  //               msg.isCancelled === true ||
  //               // 혹은 마지막 assistant 메시지(스트리밍 중)만 저장
  //               (msg.role === "assistant" && idx === messages.length - 1)
  //           );
  //           if (filteredMessages.length > 0) {
  //             filtered[chatId] = filteredMessages;
  //           }
  //         });
  //         localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  //       } catch (error) {
  //         console.warn("Failed to save streaming messages to storage:", error);
  //         // 스토리지 용량 초과 시 오래된 데이터 정리
  //         if (error.name === "QuotaExceededError") {
  //           const keys = Object.keys(streamMessages);
  //           if (keys.length > 10) {
  //             // 최대 10개 채팅만 유지
  //             const oldestKey = keys[0];
  //             resetChatMessages(oldestKey);
  //           }
  //         }
  //       }
  //     }, 1000); // 1초 디바운스

  //     return () => clearTimeout(timeoutId);
  //   }, [streamMessages, resetChatMessages]);

  return {
    streamMessages,
    addMessage,
    resetChatMessages,
    resetAllMessages,
  };
}
