from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from bson import ObjectId

# Pydantic과 MongoDB ObjectId를 연동하기 위한 커스텀 클래스
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        # 목적: Pydantic에게 이 클래스의 검증 함수를 알려줌
        # 설명: Pydantic이 데이터를 검증할 때 사용할 함수들을 등록
        yield cls.validate # validate 메서드를 검증 함수로 등록
    
    @classmethod
    def validate(cls, v):
        # 목적: 입력값이 유효한 ObjectId인지 검증
        # 설명: 다양한 형태의 입력을 ObjectId로 변환
        if not ObjectId.is_valid(v): # 이미 ObjectId인 경우 그대로 반환
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class ChatTitle(BaseModel):
    chatId: str
    title: str
    titleIsLatex: bool

class StreamRequest(BaseModel):
    question: str
    chatId: str
    title: str

class Message(BaseModel):
    role: str
    content: str
    isLatex: bool
    createdAt: datetime

class Chat(BaseModel):
    chatId: str
    userId: str
    title: str
    createdAt: datetime
    updatedAt: datetime
    messages: list[Message]