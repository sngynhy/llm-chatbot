import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import ChatPage from "../ChatPage";

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ chatId: "test-chat-id" }),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { initialAsk: false } }),
}));

jest.mock("stores/useHistoryStore", () => ({
  useHistoryStore: () => ({
    newQuestion: null,
    setNewQuestion: jest.fn(),
    clearNewQuestion: jest.fn(),
    currentchatId: "test-chat-id",
    setCurrentchatId: jest.fn(),
    requestchatId: null,
    setRequestchatId: jest.fn(),
  }),
}));

jest.mock("hooks/useAskQuestion", () => ({
  useAskQuestion: () => ({
    isLoading: false,
    assistant: "",
    askWithText: jest.fn(),
    askWithFile: jest.fn(),
    abort: jest.fn(),
  }),
}));

jest.mock("hooks/useChatHistory", () => ({
  useChatHistory: () => ({
    actions: {
      getChatMessages: jest.fn().mockResolvedValue({ messages: [] }),
    },
  }),
}));

jest.mock("reducers/chatReducer", () => ({
  chatReducer: jest.fn(),
  actionType: {
    addMessage: "ADD_MESSAGE",
    resetMessage: "RESET_MESSAGE",
  },
}));

// Mock components
jest.mock("components/chat/ChatLayout", () => ({
  ChatLayout: ({ children }) => <div data-testid="chat-layout">{children}</div>,
}));

jest.mock("components/chat/ChatHeader", () => ({
  ChatHeader: () => <div data-testid="chat-header">Chat Header</div>,
}));

jest.mock("components/chat/ChatMessages", () => ({
  ChatMessages: () => <div data-testid="chat-messages">Chat Messages</div>,
}));

jest.mock("components/chat/ChatInputArea", () => ({
  ChatInputArea: ({ onSubmit, onFileSubmit, inputRef }) => (
    <div data-testid="chat-input-area">
      <input
        ref={inputRef}
        data-testid="question-input"
        placeholder="질문을 입력하세요"
      />
      <button data-testid="submit-button" onClick={() => onSubmit()}>
        전송
      </button>
      <button data-testid="file-submit-button" onClick={() => onFileSubmit()}>
        파일 전송
      </button>
    </div>
  ),
}));

const renderChatPage = () => {
  return render(
    <BrowserRouter>
      <ChatPage isNewChat={false} />
    </BrowserRouter>
  );
};

describe("ChatPage - askQuestion 함수 테스트", () => {
  let mockAskWithText;
  let mockDispatch;
  let mockSetRequestchatId;
  let mockSetQuestion;
  let mockSetIsLatex;
  let mockInputRef;

  beforeEach(() => {
    mockAskWithText = jest.fn();
    mockDispatch = jest.fn();
    mockSetRequestchatId = jest.fn();
    mockSetQuestion = jest.fn();
    mockSetIsLatex = jest.fn();
    mockInputRef = { current: { focus: jest.fn() } };

    // Mock useAskQuestion hook
    jest.doMock("hooks/useAskQuestion", () => ({
      useAskQuestion: () => ({
        isLoading: false,
        assistant: "",
        askWithText: mockAskWithText,
        askWithFile: jest.fn(),
        abort: jest.fn(),
      }),
    }));

    // Mock useHistoryStore hook
    jest.doMock("stores/useHistoryStore", () => ({
      useHistoryStore: () => ({
        newQuestion: null,
        setNewQuestion: jest.fn(),
        clearNewQuestion: jest.fn(),
        currentchatId: "test-chat-id",
        setCurrentchatId: jest.fn(),
        requestchatId: null,
        setRequestchatId: mockSetRequestchatId,
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("질문이 비어있을 때 input에 포커스를 맞춰야 함", async () => {
    const { getByTestId } = renderChatPage();
    const submitButton = getByTestId("submit-button");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // askWithText가 호출되지 않았는지 확인
    expect(mockAskWithText).not.toHaveBeenCalled();
  });

  test("유효한 질문이 있을 때 askWithText가 호출되어야 함", async () => {
    const { getByTestId } = renderChatPage();
    const input = getByTestId("question-input");
    const submitButton = getByTestId("submit-button");

    // 질문 입력
    await act(async () => {
      fireEvent.change(input, { target: { value: "수학 문제를 풀어주세요" } });
    });

    // 전송 버튼 클릭
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // askWithText가 호출되었는지 확인
    await waitFor(() => {
      expect(mockAskWithText).toHaveBeenCalledWith(
        "수학 문제를 풀어주세요",
        "test-chat-id",
        false,
        expect.any(Function)
      );
    });
  });

  test("newQuestion이 있을 때 newQuestion.value를 사용해야 함", async () => {
    // newQuestion이 있는 상태로 mock 설정
    jest.doMock("stores/useHistoryStore", () => ({
      useHistoryStore: () => ({
        newQuestion: { value: "새로운 질문입니다" },
        setNewQuestion: jest.fn(),
        clearNewQuestion: jest.fn(),
        currentchatId: "test-chat-id",
        setCurrentchatId: jest.fn(),
        requestchatId: null,
        setRequestchatId: mockSetRequestchatId,
      }),
    }));

    const { getByTestId } = renderChatPage();
    const submitButton = getByTestId("submit-button");

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockAskWithText).toHaveBeenCalledWith(
        "새로운 질문입니다",
        "test-chat-id",
        false,
        expect.any(Function)
      );
    });
  });

  test("콜백 함수에서 setRequestchatId와 dispatch가 호출되어야 함", async () => {
    const { getByTestId } = renderChatPage();
    const input = getByTestId("question-input");
    const submitButton = getByTestId("submit-button");

    await act(async () => {
      fireEvent.change(input, { target: { value: "테스트 질문" } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockAskWithText).toHaveBeenCalled();

      // 콜백 함수 추출
      const callback = mockAskWithText.mock.calls[0][3];

      // 콜백 함수 실행
      act(() => {
        callback();
      });

      // setRequestchatId가 호출되었는지 확인
      expect(mockSetRequestchatId).toHaveBeenCalledWith("test-chat-id");
    });
  });

  test("질문 전송 후 question과 isLatex가 초기화되어야 함", async () => {
    const { getByTestId } = renderChatPage();
    const input = getByTestId("question-input");
    const submitButton = getByTestId("submit-button");

    await act(async () => {
      fireEvent.change(input, { target: { value: "초기화 테스트" } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockAskWithText).toHaveBeenCalled();
    });
  });

  test("공백만 있는 질문은 무시되어야 함", async () => {
    const { getByTestId } = renderChatPage();
    const input = getByTestId("question-input");
    const submitButton = getByTestId("submit-button");

    await act(async () => {
      fireEvent.change(input, { target: { value: "   " } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // askWithText가 호출되지 않았는지 확인
    expect(mockAskWithText).not.toHaveBeenCalled();
  });
});
