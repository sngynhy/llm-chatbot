import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useHistoryStore } from "stores/useHistoryStore";
import { ChatLayout } from "components/chat/ChatLayout";
import { ChatHeader } from "components/chat/ChatHeader";
import { ChatMessages } from "components/chat/ChatMessages";
import { ChatInputArea } from "components/chat/ChatInputArea";
import { useAskQuestion } from "hooks/useAskQuestion";
import { useChatHistory } from "hooks/useChatHistory";
import { generateChatId } from "utils/uuid";
import { useStreamingStorage } from "hooks/useStreamingStorage";
import { GoMoveToBottom } from "react-icons/go";

function ChatPage({ isNewChat }) {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { initialAsk } = location.state || false;

  const {
    newQuestion,
    setNewQuestion,
    clearNewQuestion,
    currentchatId,
    setCurrentchatId,
    requestchatId,
    setRequestchatId,
  } = useHistoryStore();

  const { streamMessages, addMessage, resetChatMessages } =
    useStreamingStorage();

  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [isLatex, setIsLatex] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const isFirstRender = useRef(true); // 최초 렌더링 체크
  const inputRef = useRef(null);
  const layoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const prevAssistantRef = useRef("");

  const { actions } = useChatHistory();
  const { isStreaming, assistant, askWithText, askWithFile, abort } =
    useAskQuestion({
      onMessageSaved: (chatId, question, assistant, isLatex) => {
        // 스트리밍 저장소에 실시간 응답 저장
        addMessage(chatId, assistant, "assistant", isLatex);
        if (newQuestion) clearNewQuestion();
      },
    });

  const getChat = useCallback(async () => {
    const res = await actions.getChatMessages(chatId);
    const messages = res.messages;
    if (Array.isArray(messages)) setChatMessages(messages);
  }, [chatId, actions]);

  useEffect(() => {
    // chatId 변경 감지
    if (currentchatId !== chatId) setCurrentchatId(chatId);

    // 컴포넌트 활성화 시 스크롤을 최하단으로 이동
    if (!isNewChat) {
      // DOM이 렌더링된 후 스크롤 실행
      setTimeout(() => {
        layoutRef.current?.scrollToBottom();
      }, 100);
    }

    return () => {
      // 응답 중이 아닐 때만 해당 chatId의 실시간 메시지 초기화
      if (chatId !== requestchatId && !isStreaming) {
        resetChatMessages(chatId);
      }
    };
  }, [chatId]);

  useEffect(() => {
    // 질문 내역 페이지일 경우 채팅 메시지 가져오기
    if (!isNewChat && !initialAsk) {
      getChat().then(() => {
        // 메시지 로드 완료 후 스크롤을 최하단으로 이동
        setTimeout(() => {
          layoutRef.current?.scrollToBottom();
        }, 100);
      });
    }
  }, [isNewChat, initialAsk, getChat]);

  useEffect(() => {
    // 새 질문 페이지일 경우
    if (isNewChat) {
      if (currentchatId !== null) setCurrentchatId(null);
      if (chatMessages.length > 0) setChatMessages([]);
      return;
    }

    // 새 질문 페이지에서 넘어온 경우 질문 전송
    if (initialAsk && isFirstRender.current) {
      if (!newQuestion) {
        navigate("/");
        return;
      }

      const { type, value } = newQuestion;
      if (type === "text") {
        setQuestion(value);
        askQuestion();
      } else {
        setFile(value);
        askWithImage();
      }
      isFirstRender.current = false;
    }
  }, [newQuestion, initialAsk, isNewChat]);

  // 자동 스크롤 함수
  const smartScrollToBottom = useCallback(() => {
    if (!isNewChat && isStreaming) {
      const prevContent = prevAssistantRef.current;
      const currentContent = assistant;

      // 줄바꿈이 추가되었거나 내용이 크게 변경되었을 때만 스크롤
      const prevLines = prevContent.split("\n").length;
      const currentLines = currentContent.split("\n").length;
      const hasNewLine = currentLines > prevLines;
      const hasSignificantChange =
        currentContent.length - prevContent.length > 10;

      if (hasNewLine || hasSignificantChange) {
        // 디바운스 적용
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          layoutRef.current?.scrollToBottom();
        }, 100);
      }

      prevAssistantRef.current = currentContent;
    }
  }, [isNewChat, isStreaming, assistant]);

  // assistant 변경 감지 (스트리밍 중 실시간 스크롤)
  useEffect(() => {
    if (isStreaming && assistant) {
      smartScrollToBottom();
    }
  }, [assistant, isStreaming, smartScrollToBottom]);

  // 컴포넌트 정리 (타이머 정리)
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 메시지가 추가될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    if (
      !isNewChat &&
      (chatMessages.length > 0 ||
        (streamMessages[chatId] && streamMessages[chatId].length > 0))
    ) {
      setTimeout(() => {
        layoutRef.current?.scrollToBottom();
      }, 100);
    }
  }, [chatMessages, streamMessages, chatId, isNewChat]);

  const askNewQuestion = () => {
    // console.log('🎃 askNewQuestion', question);

    if (!file && question === undefined) return inputRef.current.focus();

    const param = {
      type: !file ? "text" : "file",
      value: !file ? question : file,
    };
    setNewQuestion(param);
    const chatId = generateChatId();
    setCurrentchatId(chatId);
    navigate(`/chat/${chatId}`, { state: { initialAsk: true } });
  };

  const askQuestion = async () => {
    const questionCopy = newQuestion?.value || question;
    if (!questionCopy.trim()) return inputRef.current.focus();

    // console.log('✨askQuestion', questionCopy);
    await askWithText(questionCopy, chatId, initialAsk, () => {
      setRequestchatId(chatId);
      // 스트리밍 저장소에 실시간 질문 저장
      addMessage(chatId, questionCopy, "user");
    });

    setQuestion("");
    setIsLatex(false);
  };

  const askWithImage = async () => {
    // console.log('🎞askWithImage', );

    const fileCopy = newQuestion?.value || file;

    await askWithFile(fileCopy, chatId, () => setRequestchatId(chatId));

    setFile(null);
    setIsLatex(true);
  };

  return (
    <ChatLayout isNewChat={isNewChat} chatId={chatId} ref={layoutRef}>
      {isNewChat ? (
        <ChatHeader />
      ) : (
        <ChatMessages
          isStreaming={isStreaming}
          messages={[...chatMessages, ...(streamMessages[chatId] || [])]}
          assistant={assistant}
          isLatex={isLatex}
          currentchatId={chatId}
          requestchatId={requestchatId}
        />
      )}

      <ChatInputArea
        isNewChat={isNewChat}
        isStreaming={isStreaming}
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
  );
}

export default ChatPage;
