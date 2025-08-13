from fastapi import FastAPI
from .chat import router as chat_router
from .chat_stream import router as chat_stream_router

def register_routers(app: FastAPI):
    # 모든 라우터를 앱에 등록
    app.include_router(chat_router, prefix="/api/chats", tags=["chat"])
    app.include_router(chat_stream_router, prefix="/api/stream", tags=["chat_stream"])

__all__ = ["register_routers"]