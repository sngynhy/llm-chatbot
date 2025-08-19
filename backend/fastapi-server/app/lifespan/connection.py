from fastapi import FastAPI, Request
import inspect
from contextlib import asynccontextmanager
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
    AsyncIOMotorCollection,
)
from openai import AsyncOpenAI
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # MongoDB
    mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = mongo_client[settings.MONGODB_DB]
    app.state.mongo_client = mongo_client
    app.state.db = db
    app.state.col = db[settings.MONGODB_COLLECTION]

    # Ollama(AsyncOpenAI)
    ollama_client = AsyncOpenAI(
		base_url=settings.OLLAMA_BASE_URL,
		api_key=settings.OLLAMA_API_KEY,
	)
    app.state.ollama = ollama_client

    try:
        yield
    finally:
        # MongoDB 종료
        mongo_client.close()

        # Ollama 종료 > OpenAI SDK 버전에 따라 AsyncOpenAI에 aclose 또는 close가 있을 수 있음
        if hasattr(ollama_client, "aclose"):
            await ollama_client.aclose()
        elif hasattr(ollama_client, "close"):
            maybe_coro = ollama_client.close()
            if inspect.isawaitable(maybe_coro):
                await maybe_coro


def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db

def get_collection(request: Request) -> AsyncIOMotorCollection:
    return request.app.state.col

def get_ollama(request: Request) -> AsyncOpenAI:
	return request.app.state.ollama