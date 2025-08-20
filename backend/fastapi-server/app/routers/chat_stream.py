from fastapi import APIRouter, Request, Depends
from fastapi.responses import StreamingResponse
from app.models import StreamRequest
from app.services import ChatService, ChatStreamService
from openai import AsyncOpenAI
from app.lifespan.connection import get_ollama, get_collection, get_redis
from motor.motor_asyncio import AsyncIOMotorCollection
from redis.asyncio import Redis

router = APIRouter()

headers = {
    # "Content-Type": "text/plain",
    "Content-Type": "text/event-stream", # 스트리밍 데이터임을 명시 (SSE 등)
    "X-Accel-Buffering": "no",  # Nginx의 응답 버퍼링 방지
    "Cache-Control": "no-cache, no-transform", # 캐시 방지 + 중간 장치가 내용 변경하지 못하도록 함
    "Transfer-Encoding": "chunked",  # 응답을 chunk 단위로 전송 (전체 크기 없이도 가능)
    "Connection": "keep-alive" # 연결 유지 → 스트림 연결 유지
}

def get_chat_stream_service(
    ollama: AsyncOpenAI = Depends(get_ollama),
    redis: Redis = Depends(get_redis),
    col: AsyncIOMotorCollection = Depends(get_collection),
) -> ChatStreamService:
    return ChatStreamService(ollama, redis, ChatService(col))

@router.post("/")
async def chat_stream(
    body: StreamRequest,
    request: Request,
    svc: ChatStreamService = Depends(get_chat_stream_service)
):
    return StreamingResponse(
        svc.stream(body, request),
        headers=headers,
        media_type="text/event-stream"
    )

# @router.post("/chat/stream")
# async def stream_chat(body: AskRequest):
#     return StreamingResponse(ChatStreamService().stream(body.question), headers=headers, media_type="text/event-stream")
