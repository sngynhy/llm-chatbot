from motor.motor_asyncio import AsyncIOMotorCollection
from app.repositories.chat_repository import (
    fetch_chat, fetch_titles, save_chat, delete_chat, search
)

class ChatService:
    def __init__(self, col: AsyncIOMotorCollection):
        self.col = col

    async def get_chat(self, chat_id: str):
        return await fetch_chat(self.col, chat_id)

    async def list_titles(self):
        return await fetch_titles(self.col)

    async def save_chat(self, data: dict):
        return await save_chat(self.col, data)

    async def delete_chat(self, chat_id: str):
        return await delete_chat(self.col, chat_id)

    async def search(self, keyword: str):
        return await search(self.col, keyword)