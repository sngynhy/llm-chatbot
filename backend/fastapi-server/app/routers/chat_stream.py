from tkinter.constants import S
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from app.models.chat import StreamRequest
from ..services.chat_stream_service import ChatStreamService
# from starlette.exceptions import ClientDisconnect

router = APIRouter()

headers = {
    # "Content-Type": "text/plain",
    "Content-Type": "text/event-stream", # 스트리밍 데이터임을 명시 (SSE 등)
    "X-Accel-Buffering": "no",  # Nginx의 응답 버퍼링 방지
    "Cache-Control": "no-cache, no-transform", # 캐시 방지 + 중간 장치가 내용 변경하지 못하도록 함
    "Transfer-Encoding": "chunked",  # 응답을 chunk 단위로 전송 (전체 크기 없이도 가능)
    "Connection": "keep-alive" # 연결 유지 → 스트림 연결 유지
}

@router.post("/stream")
async def chat_stream(body: StreamRequest, request: Request):
    print('body', body)
    print('request', request)

    # async def agen():
    #     try:
    #         async for chunk in svc.stream(body.question, request):
    #             yield chunk
    #     except (ClientDisconnect, asyncio.CancelledError):
    #         # 취소 신호 수신
    #         return
    # return StreamingResponse(agen(), media_type="text/event-stream")

# @router.post("/chat/stream")
# async def stream_chat(body: AskRequest):
#     return StreamingResponse(ChatStreamService().stream(body.question), headers=headers, media_type="text/event-stream")
