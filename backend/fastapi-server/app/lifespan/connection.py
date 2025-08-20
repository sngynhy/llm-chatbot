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
from redis.asyncio import Redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    # MongoDB 초기화
    mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = mongo_client[settings.MONGODB_DB]
    app.state.mongo_client = mongo_client
    app.state.db = db
    app.state.col = db[settings.MONGODB_COLLECTION]

    # Ollama(AsyncOpenAI) 초기화
    ollama_client = AsyncOpenAI(
		base_url=settings.OLLAMA_BASE_URL,
		api_key=settings.OLLAMA_API_KEY,
	)
    app.state.ollama = ollama_client

    # Redis 초기화
    redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)
    app.state.redis = redis_client

    try:
        yield
    finally:
        # MongoDB 종료
        maybe_coro_mongo = mongo_client.close() # 비동기 코루틴 반환
        if inspect.isawaitable(maybe_coro_mongo): # 비동기 코루틴인지 확인
            await maybe_coro_mongo # 비동기 코루틴 실행

        # Ollama 종료 > SDK 버전에 따라 .aclose() 또는 .close() 사용
        maybe_coro_ollama = getattr(ollama_client, "aclose", None)
        if maybe_coro_ollama is None:
            print("Ollama aclose() is None")
            maybe_coro_ollama = getattr(ollama_client, "close", None)
        if maybe_coro_ollama:
            print("Ollama aclose() is not None")
            result = maybe_coro_ollama()
            if inspect.isawaitable(result):
                await result

        # Redis 종료 > redis-py asyncio 클라이언트는 connection_pool.disconnect() 권장
        if hasattr(redis_client, "close"):
            print("Redis close()")
            maybe_coro_redis = redis_client.close()
            if inspect.isawaitable(maybe_coro_redis):
                await maybe_coro_redis
        elif hasattr(redis_client, "connection_pool"):
            print("Redis connection_pool.disconnect()")
            maybe_coro_pool = redis_client.connection_pool.disconnect()
            if inspect.isawaitable(maybe_coro_pool):
                await maybe_coro_pool


def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db

def get_collection(request: Request) -> AsyncIOMotorCollection:
    return request.app.state.col

def get_ollama(request: Request) -> AsyncOpenAI:
	return request.app.state.ollama

def get_redis(request: Request) -> Redis:
    return request.app.state.redis