from fastapi import APIRouter, Request, Depends
from fastapi.responses import StreamingResponse
from app.models import StreamRequest
from app.services import ChatStreamService
from openai import AsyncOpenAI
from app.lifespan.connection import get_ollama

router = APIRouter()

headers = {
    # "Content-Type": "text/plain",
    "Content-Type": "text/event-stream", # 스트리밍 데이터임을 명시 (SSE 등)
    "X-Accel-Buffering": "no",  # Nginx의 응답 버퍼링 방지
    "Cache-Control": "no-cache, no-transform", # 캐시 방지 + 중간 장치가 내용 변경하지 못하도록 함
    "Transfer-Encoding": "chunked",  # 응답을 chunk 단위로 전송 (전체 크기 없이도 가능)
    "Connection": "keep-alive" # 연결 유지 → 스트림 연결 유지
}

def get_chat_stream_service(ollama: AsyncOpenAI = Depends(get_ollama)) -> ChatStreamService:
    return ChatStreamService(ollama)

@router.post("/")
async def chat_stream(
    body: StreamRequest,
    request: Request,
    svc: ChatStreamService = Depends(get_chat_stream_service)
):

    # async def safe_generator():
    #     try:
    #         async for chunk in svc.stream(body.question, request):
    #             yield chunk
    #     except ClientDisconnect:
    #         print("🔌 라우터: ClientDisconnect 감지")
    #     except asyncio.CancelledError:
    #         print("🔌 라우터: 요청 취소됨")
    #     except Exception as e:
    #         print(f"🔌 라우터: 예상치 못한 오류 {e}")
    #         yield f"data: [스트림 오류]\n\n".encode("utf-8")

    return StreamingResponse(
        svc.stream(body.prompt),
        headers=headers,
        media_type="text/event-stream"
    )

# @router.post("/chat/stream")
# async def stream_chat(body: AskRequest):
#     return StreamingResponse(ChatStreamService().stream(body.question), headers=headers, media_type="text/event-stream")
