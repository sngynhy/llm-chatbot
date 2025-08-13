from motor.motor_asyncio import AsyncIOMotorCollection
from datetime import datetime, timezone

# chat 조회
async def fetch_chat(collection: AsyncIOMotorCollection, chat_id: str, user_id: str = "user1"):
    return await collection.find_one(
        {"userId": user_id, "chatId": chat_id, "isDeleted": 0},
        {"_id": 0},
    )

# 타이틀만 추출
async def fetch_titles(collection: AsyncIOMotorCollection, user_id: str = "user1"):
    cursor = collection.find(
        {"userId": user_id, "isDeleted": 0},
        {"_id": 0, "chatId": 1, "title": 1, "titleIsLatex": 1},
    ).sort("createdAt", -1)
    return await cursor.to_list(length=20) # 최대 20개 추출


# chat 저장
async def save_chat(collection: AsyncIOMotorCollection, data: dict):
    new_message = data.get("messages", [])
    if not new_message:
        return  # 저장할 메시지가 없으면 무시
    
    # 저장할 구조 구성
    chat_doc = {
        "$set": {
            "updatedAt": datetime.now(timezone.utc),
        },
        "$setOnInsert": {
            "userId": data["userId"],
            "chatId": data["chatId"],
            "title": data.get("title", ""),
            "titleIsLatex": data.get("titleIsLatex", False),
            "createdAt": datetime.now(timezone.utc),
            # "isActive": 1,
            "isDeleted": 0,
        },
        "$push": {
            "messages": {"$each": new_message},
        }
    }

    # 기존 chatId가 있으면 업데이트, 없으면 새로 저장
    # update_one: 부분 수정, replace_one: 전체 교체
    await collection.update_one(
        {"chatId": data["chatId"]},
        chat_doc,
        upsert=True, # 없으면 새로 삽입
    )

    return data["chatId"]


# chat 삭제
async def delete_chat(collection: AsyncIOMotorCollection, chat_id: str, user_id: str = "user1"):
    return await collection.update_one(
        {"chatId": chat_id, "userId": user_id},
        {"$set": {"isDeleted": 1}},
    )

# 특정 문자열이 포함된 문서 검색 (대소문자 구분 X)
async def search(collection: AsyncIOMotorCollection, keyword: str):
    cursor = collection.find({
        'content': {
            "$regex": '^' + keyword + '^',
            "$options": "i"  # 'i'는 대소문자 무시 (ignore case)
        }
    })
    return await cursor.to_list(length=100)