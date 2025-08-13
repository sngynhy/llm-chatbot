from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
    AsyncIOMotorCollection,
)
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB]
    app.state.mongo_client = client
    app.state.db = db
    app.state.col = db[settings.MONGODB_COLLECTION]

    try:
        yield
    finally:
        client.close()


def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db


def get_collection(request: Request) -> AsyncIOMotorCollection:
    return request.app.state.col