import { askQuestionApi } from "api/askApi";
import { AskQuestionRequest } from "types/api";

// API에서 데이터를 스트리밍으로 받아와 넘겨줌
export const fetchTextAnswer = async (
  data: AskQuestionRequest,
  signal: AbortSignal,
  onChunk: (chunk: string) => void
) => {
  const response = await askQuestionApi(data, signal);
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    // console.log(chunk);
    onChunk(chunk); // 스트리밍으로 한 덩어리 처리
  }
};
