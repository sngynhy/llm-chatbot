from fastapi import APIRouter, HTTPException, Depends
from app.database.connection import get_collection
from app.services.chat_service import ChatService
from motor.motor_asyncio import AsyncIOMotorCollection
from app.models import ChatTitle

router = APIRouter()

def get_chat_service(col: AsyncIOMotorCollection = Depends(get_collection)) -> ChatService:
    return ChatService(col)

@router.get(
    "/titles",
    response_model=list[ChatTitle],
    summary="채팅 타이틀 목록 조회",
    tags=["chats"],
    responses={
        200: {"description": "성공", "content": {"application/json": {}}},
        500: {"description": "서버 오류"},
})
async def get_all_titles_api(svc: ChatService = Depends(get_chat_service)):
    data = await svc.list_titles()
    return data

@router.get("/{chat_id}")
async def get_chat_api(chat_id: str, svc: ChatService = Depends(get_chat_service)):
    data = await svc.get_chat(chat_id)
    if not data:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"status": "success", "data": data}

# @router.post("/chats")
# async def save_chat_api(data: dict, svc: ChatService = Depends(get_chat_service)):
#     chat_id = await svc.save_chat(data)
#     return {"status": "success", "chatId": chat_id}

@router.delete(
    "/{chat_id}",
    summary="채팅 내역 삭제",
    tags=["chat"],
    responses={
        200: {"description": "삭제 성공"},
        404: {"description": "존재하지 않는 chat_id"},
        500: {"description": "서버 오류(전역 핸들러)"}
})
async def delete_chat_api(chat_id: str, svc: ChatService = Depends(get_chat_service)):
        res = await svc.delete_chat(chat_id)
        if res.modified_count == 1:
            return {"status": "success"}
        raise HTTPException(status_code=404, message=f"Chat {chat_id} not found")