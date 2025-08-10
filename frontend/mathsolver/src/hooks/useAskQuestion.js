import { useState, useRef } from "react";
import { askWithImageApi } from "api/askApi";
import { fetchTextAnswer } from "utils/fetchAsk";
import { useHistoryStore } from "stores/useHistoryStore";

// 질문 받아서 처리
export function useAskQuestion({ onMessageSaved }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const [assistant, setAssistant] = useState("");
  // const [isStreamingStarted, setIsStreamingStarted] = useState(false)
  // const [isStreamingDone, setIsStreamingDone] = useState(false)
  const controllerRef = useRef(null);
  const bufferRef = useRef("");
  const startedRef = useRef("");
  const { addChatId, addChatTitle, setRequestchatId } = useHistoryStore();

  const askWithText = async (question, chatId, initialAsk, onBeforeStart) => {
    if (!question.trim()) return;

    setIsStreaming(true);
    bufferRef.current = "";
    controllerRef.current = new AbortController();

    const signal = controllerRef.current.signal;

    try {
      onBeforeStart?.();

      const data = {
        chatId: chatId,
        question: question,
        title: question.slice(0, 18) || "New Chat",
        titleIsLatex: false,
      };
      await fetchTextAnswer(data, signal, (chunk) => {
        bufferRef.current += chunk;
        if (!startedRef.current && initialAsk) {
          // 스트림 응답 시작 시점 > 새 질문 페이지일 경우 질문 내역 리스트에 타이틀 추가
          startedRef.current = true;
          addChatId(chatId);
          addChatTitle({
            chatId: chatId,
            title: data.title,
            titleIsLatex: false,
          });
        }
        setAssistant(bufferRef.current);
      });

      onMessageSaved?.(chatId, question, bufferRef.current, false);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("요청 취소", bufferRef.current);
        onMessageSaved?.(chatId, question, bufferRef.current, false);
      } else {
        console.log("요청 실패:", err);
        setError(
          "죄송합니다. 문제가 발생하였습니다.\n잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setIsStreaming(false);
      setRequestchatId(null);
      setAssistant("");
    }
  };

  const askWithFile = async (file, chatId, initialAsk, onBeforeStart) => {
    if (!file) return;

    setIsStreaming(true);
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      onBeforeStart?.();

      const response = await askWithImageApi(file, signal);
      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      const { latex, assistant } = data;

      onMessageSaved?.(chatId, latex, assistant, true);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("요청이 취소되었습니다.");
      } else {
        console.log("요청 실패:", err);
        setError(
          "죄송합니다. 문제가 발생하였습니다.\n잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setIsStreaming(false);
      setAssistant("");
    }
  };

  const abort = () => controllerRef.current?.abort();

  return { isStreaming, error, assistant, askWithText, askWithFile, abort };
}
