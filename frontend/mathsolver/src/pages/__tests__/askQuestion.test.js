// askQuestion 함수의 로직을 테스트하는 파일

describe("askQuestion 함수 테스트", () => {
  let mockAskWithText;
  let mockSetRequestchatId;
  let mockDispatch;
  let mockSetQuestion;
  let mockSetIsLatex;
  let mockInputRef;
  let mockNewQuestion;
  let mockQuestion;
  let mockChatId;
  let mockInitialAsk;

  beforeEach(() => {
    // Mock 함수들 초기화
    mockAskWithText = jest.fn();
    mockSetRequestchatId = jest.fn();
    mockDispatch = jest.fn();
    mockSetQuestion = jest.fn();
    mockSetIsLatex = jest.fn();
    mockInputRef = { current: { focus: jest.fn() } };

    // 테스트 데이터 초기화
    mockNewQuestion = null;
    mockQuestion = "";
    mockChatId = "test-chat-id";
    mockInitialAsk = false;
  });

  // askQuestion 함수를 시뮬레이션하는 함수
  const simulateAskQuestion = async () => {
    const questionCopy = mockNewQuestion?.value || mockQuestion;

    if (!questionCopy.trim()) {
      return mockInputRef.current.focus();
    }

    await mockAskWithText(questionCopy, mockChatId, mockInitialAsk, () => {
      mockSetRequestchatId(mockChatId);
      mockDispatch({
        type: "ADD_MESSAGE",
        payload: {
          chatId: mockChatId,
          content: questionCopy,
          role: "user",
        },
      });
    });

    mockSetQuestion("");
    mockSetIsLatex(false);
  };

  test("질문이 비어있을 때 input에 포커스를 맞춰야 함", async () => {
    mockQuestion = "";

    await simulateAskQuestion();

    expect(mockInputRef.current.focus).toHaveBeenCalled();
    expect(mockAskWithText).not.toHaveBeenCalled();
  });

  test("공백만 있는 질문은 무시되어야 함", async () => {
    mockQuestion = "   ";

    await simulateAskQuestion();

    expect(mockInputRef.current.focus).toHaveBeenCalled();
    expect(mockAskWithText).not.toHaveBeenCalled();
  });

  test("유효한 질문이 있을 때 askWithText가 호출되어야 함", async () => {
    mockQuestion = "수학 문제를 풀어주세요";

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalledWith(
      "수학 문제를 풀어주세요",
      "test-chat-id",
      false,
      expect.any(Function)
    );
    expect(mockInputRef.current.focus).not.toHaveBeenCalled();
  });

  test("newQuestion이 있을 때 newQuestion.value를 사용해야 함", async () => {
    mockNewQuestion = { value: "새로운 질문입니다" };
    mockQuestion = "기존 질문";

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalledWith(
      "새로운 질문입니다",
      "test-chat-id",
      false,
      expect.any(Function)
    );
  });

  test("콜백 함수에서 setRequestchatId가 호출되어야 함", async () => {
    mockQuestion = "테스트 질문";

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalled();

    // 콜백 함수 추출 및 실행
    const callback = mockAskWithText.mock.calls[0][3];
    callback();

    expect(mockSetRequestchatId).toHaveBeenCalledWith("test-chat-id");
  });

  test("콜백 함수에서 dispatch가 올바른 payload와 함께 호출되어야 함", async () => {
    mockQuestion = "테스트 질문";

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalled();

    // 콜백 함수 추출 및 실행
    const callback = mockAskWithText.mock.calls[0][3];
    callback();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_MESSAGE",
      payload: {
        chatId: "test-chat-id",
        content: "테스트 질문",
        role: "user",
      },
    });
  });

  test("질문 전송 후 question과 isLatex가 초기화되어야 함", async () => {
    mockQuestion = "초기화 테스트";

    await simulateAskQuestion();

    expect(mockSetQuestion).toHaveBeenCalledWith("");
    expect(mockSetIsLatex).toHaveBeenCalledWith(false);
  });

  test("initialAsk가 true일 때 올바르게 전달되어야 함", async () => {
    mockQuestion = "테스트 질문";
    mockInitialAsk = true;

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalledWith(
      "테스트 질문",
      "test-chat-id",
      true,
      expect.any(Function)
    );
  });

  test("chatId가 다른 값일 때 올바르게 전달되어야 함", async () => {
    mockQuestion = "테스트 질문";
    mockChatId = "different-chat-id";

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalledWith(
      "테스트 질문",
      "different-chat-id",
      false,
      expect.any(Function)
    );
  });

  test("newQuestion과 question이 모두 있을 때 newQuestion이 우선되어야 함", async () => {
    mockNewQuestion = { value: "우선순위 질문" };
    mockQuestion = "무시될 질문";

    await simulateAskQuestion();

    expect(mockAskWithText).toHaveBeenCalledWith(
      "우선순위 질문",
      "test-chat-id",
      false,
      expect.any(Function)
    );
  });
});
