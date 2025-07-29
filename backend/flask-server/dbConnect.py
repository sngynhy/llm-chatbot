from flask import jsonify
from pymongo import MongoClient, DESCENDING
from datetime import datetime, timezone

# MongoDB 연결
client = MongoClient("mongodb://localhost:27017")
db = client["chatbot"]  # DB 이름
collection = db["chats"]  # 콜렉션 이름
user_id = "user1" # 인증 기능 추가 후 수정

# chat 저장
def save_chat(data):
    # print('save_chat', data)

    new_message = data.get("messages", [])
    if not new_message:
        return  # 저장할 메시지가 없으면 무시
    
    # 저장할 구조 구성
    chat_doc = {
        "$set": {
            "updatedAt": datetime.now(timezone.utc),
        },
        "$setOnInsert": {
            "userId": user_id,
            "chatId": data["chatId"],
            "title": data.get("title", ""),
            "titleIsLatex": data.get("titleIsLatex", False),
            "createdAt": datetime.now(timezone.utc),
            # "is_active": 1,
            "is_deleted": 0,
        },
        "$push": {
            "messages": {"$each": new_message},
        }
    }

    # 기존 chatId가 있으면 업데이트, 없으면 새로 저장
    # update_one: 부분 수정, replace_one: 전체 교체
    collection.update_one(
        {"chatId": data["chatId"]},
        chat_doc,
        upsert=True # 없으면 새로 삽입
    )

# chat 조회
def get_chat(chat_id):
    return collection.find_one({"userId": user_id, "chatId": chat_id}, {"_id": 0})

# 전체 세션 목록 조회
def get_all_chats():
    return list(collection.find({}, {"_id": 0, "chatId": 1, "title": 1, "createdAt": 1})).sort("createdAt", DESCENDING)

# 타이틀만 추출
def get_all_titles():
    return list(collection.find({"userId": user_id, "is_deleted": 0}, {'_id': 0, 'chatId': 1, 'title': 1, 'titleIsLatex': 1}).sort("createdAt", DESCENDING))

# chat 삭제 > chat_id 기준으로 해당 데이터 비활성으로 처리
def delete_chat(chat_id):
    return collection.update_one(
        {'chatId': chat_id},
        {'$set': {'is_deleted': 1}}
    )