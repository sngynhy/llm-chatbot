import { askQuestionApi } from "api/askApi"

// API에서 데이터를 스트리밍으로 받아와 넘겨줌
export const fetchTextAnswer = async (question, signal, onChunk) => {
    const response = await askQuestionApi(question, signal)
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const res = decoder.decode(value, { stream: true })
        onChunk(res) // 스트리밍으로 한 덩어리 처리
    }
}