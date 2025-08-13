from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, StarletteHTTPException
import time
import logging
from .config import settings
from .routers import register_routers
from .database.connection import lifespan

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# 전역 변수
logger = logging.getLogger(__name__)

tags_metadata = [
    {"name": "chat", "description": "채팅/스트리밍 API"},
    {"name": "history", "description": "대화 히스토리/타이틀"},
]

def create_app() -> FastAPI:
    """FastAPI 앱 생성 팩토리"""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        lifespan=lifespan,
        docs_url="/docs",            # Swagger UI 경로 (기본: /docs)
        redoc_url="/redoc",          # ReDoc 경로 (기본: /redoc)
        openapi_url="/openapi.json", # 스펙 경로 (기본: /openapi.json)
        openapi_tags=tags_metadata,
        swagger_ui_parameters={
            "defaultModelsExpandDepth": -1,     # 좌측 Models 섹션 숨김
            "displayRequestDuration": True,     # 요청 시간 표시
        },
    )

    # CORS 미들웨어
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 라우터 등록
    register_routers(app)

    # 타이밍 미들웨어
    @app.middleware("http")
    async def timing_middleware(request: Request, call_next):
        start = time.time()
        try:
            response = await call_next(request)
            return response
        finally:
            duration = time.time() - start
            logger.info(f"요청 처리 시간: {duration:.3f}s")

    # 전역 예외 처리
    # 404/403 등 HTTPException 포맷 통일
    @app.exception_handler(StarletteHTTPException)
    async def http_exc_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"status": "error", "message": exc.detail or "HTTP error"},
        )

    # pydantic 검증 오류(422) 포맷 통일
    # @app.exception_handler(RequestValidationError)
    # async def validation_exc_handler(request: Request, exc: RequestValidationError):
    #     return JSONResponse(
    #         status_code=422,
    #         content={"status": "error", "message": exc.errors()},
    #     )

    # 나머지 모든 예외 → 500
    @app.exception_handler(Exception)
    async def unhandled_exc_handler(request: Request, exc: Exception):
        # 필요하면 여기서 로깅
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": "Internal Server Error"},
        )

    logger.info(f"FastAPI 앱이 생성되었습니다. (v{settings.VERSION})")
    return app

__version__ = settings.VERSION