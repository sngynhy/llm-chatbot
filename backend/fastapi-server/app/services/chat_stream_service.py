from datetime import datetime, timezone
from fastapi import FastAPI, Request
from app.models import StreamRequest
from openai import AsyncOpenAI
from app.config import settings
import asyncio
from redis.asyncio import Redis
from app.services import ChatService
import time

MODEL_NAME = "gemma:2b" # mistral, gemma:7b, wizard-math

class ChatStreamService:
    def __init__(self, ollama_client: AsyncOpenAI, redis_client: Redis, chat_service: ChatService):
        self.client = ollama_client
        self.redis = redis_client
        self.chat_service = chat_service

    async def stream(self, body: StreamRequest, request: Request):
        user_id = body.userId
        chat_id = body.chatId
        title = body.title
        prompt = body.prompt
        ttl = settings.REDIS_TTL_SECONDS # 청크 수신 시마다 EXPIRE 갱신
        buffer_key = f"chat:{chat_id}:buffer" # chunk 누적 (리스트)
        meta_key = f"chat:{chat_id}:meta" # 메타 정보 (해시) > (status, userId, title, timestamps)
        # status 값 > streaming → finalized(정상 완료) / aborted(클라이언트 끊김)

        # 시작 메타 기록
        await self.redis.hset(meta_key, mapping={
            "statue": "streaming",
            "title": title,
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        })
        await self.redis.expire(meta_key, ttl)

        # print('stream', question)
        messages = [
            {"role": "system", "content": "간단히 한국어로 설명해줘."},
            {"role": "user", "content": prompt},
        ]

        full_response = []

        try:
            stream = await self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                stream=True,
                # temperature=0.7,
                # max_tokens=1000,
            )
            async for event in stream:
                # if hasattr(request, 'is_disconnected') and await request.is_disconnected():
                #     print('request.is_disconnected > ', request.is_disconnected())
                #     break

                # if hasattr(request.client, 'host') and request.client.host:
                #     print('request.client.host > ', request.client.host, request.client.port)
                #     break

                chunk = getattr(event, "chunk", event)
                if not hasattr(chunk, "choices") or not chunk.choices:
                    continue

                content = chunk.choices[0].delta.content or ""
                if not content:
                    continue

                # 문장 끝 기호들 감지하여 줄바꿈 처리 (점, 느낌표, 물음표)
                if content.endswith((".", "!", "?")):
                    content += '\n'

                # redis에 임시 저장
                await self.redis.rpush(buffer_key, content) # 버퍼 저장
                await self.redis.expire(buffer_key, ttl) # 버퍼 만료 시간 설정
                await self.redis.hset(meta_key, mapping={ # 메타 업데이트
                    "updatedAt": datetime.now(timezone.utc).isoformat(),
                })
                await self.redis.expire(meta_key, ttl) # 메타 만료 시간 설정

                # print(content, end="", flush=True)
                full_response.append(content)
                yield content.encode("utf-8")
                await asyncio.sleep(0.05)
            else:
                print("🔌🔌 스트림 정상 종료")
                await self._finalize_chat(
                    user_id,
                    chat_id,
                    buffer_key,
                    meta_key,
                    prompt,
                    title,
                    "finalized",
                    full_parts=full_response,
                    fast_answer=''.join(full_response),
                )

        except Exception as e:
            print(f"🔌 스트림 오류: {e}")
            await self._finalize_chat(
                user_id,
                chat_id,
                buffer_key,
                meta_key,
                prompt,
                title,
                "aborted",
                full_parts=full_response,
                fast_answer=''.join(full_response),
            )
            yield f"\n[오류 발생: {str(e)}]\n\n".encode("utf-8")
        finally:
            # 스트림 객체 존재 시 닫기
            try:
                if 'stream' in locals():
                    if hasattr(stream, "aclose"):
                        await stream.aclose()
                    elif hasattr(stream, "close"):
                        maybe = stream.close()
                        if asyncio.iscoroutine(maybe):
                            await maybe
            except Exception:
                pass
            print("🔌🔌 연결 종료", ''.join(full_response))
            # 최종 저장
            await self._finalize_chat(
                user_id,
                chat_id,
                buffer_key,
                meta_key,
                prompt,
                title,
                "aborted",
                full_parts=full_response,
                fast_answer=''.join(full_response),
            )


    async def _finalize_chat(
        self,
        user_id: str,
        chat_id: str,
        buffer_key: str,
        meta_key: str,
        prompt: str,
        title: str,
        status: str,
        full_parts: list[str] | None = None,
        fast_answer: str | None = None,
    ):
        print("_finalize_chat", user_id, status, buffer_key, meta_key)
        # 우선순위: fast_answer → full_parts join → Redis LRANGE
        answer = fast_answer or ""
        if not answer:
            if full_parts:
                answer = "".join(full_parts)
            else:
                try:
                    parts = await self.redis.lrange(buffer_key, 0, -1)
                    answer = "".join(parts)
                except Exception:
                    answer = ""

        now = datetime.now(timezone.utc)
        await self.redis.hset(meta_key, mapping={
            "status": status,
            "finalizedAt": now.isoformat(),
        })

        # MongoDB 확정 저장
        if answer:
            await self.chat_service.save_chat({
                "userId": user_id,
                "chatId": chat_id,
                "title": title,
                "titleIsLatex": False,
                "messages": [
                    {"role": "user", "content": prompt, "createdAt": now, "isLatex": False},
                    {"role": "assistant", "content": answer, "createdAt": now, "isLatex": False},
                ],
            })

        # 임시 버퍼 제거, 메타는 잠시 유지
        try:
            await self.redis.delete(buffer_key)
            await self.redis.expire(meta_key, 300)
        except Exception:
            pass

    # async def stream_old(self, question: str, request: Request):
    #     # print('stream', question)
    #     messages = [
    #         {"role": "system", "content": "간단히 한국어로 설명해줘."},
    #         {"role": "user", "content": question},
    #     ]

    #     context = {"full_response": ""}

    #     try:
    #         # AsyncOpenAI 스트리밍 (비동기)
    #         async with self.client.chat.completions.stream(
    #             model=MODEL_NAME,
    #             messages=messages,
    #             stream=True,
    #             # temperature=0.7,
    #             # max_tokens=1000,
    #         ) as stream:
    #             async for chunk_event in stream:
    #                 print('chunk_event > ', chunk_event)

    #                 # 클라이언트 연결 상태 확인
    #                 if await request.is_disconnected():
    #                     logging.info("클라이언트 연결 해제 감지")
    #                     await stream.close()  # 해당 요청 스트림 종료
    #                     break

    #                 if isinstance(chunk_event, ContentDeltaEvent):
    #                     continue

    #                 # chunk_event에서 chunk 추출
    #                 chunk = chunk_event.chunk
    #                 if not chunk.choices:
    #                     continue

    #                 content = chunk.choices[0].delta.content or ""
    #                 if not content:
    #                     continue

    #                 # 문장 끝 기호들 감지하여 줄바꿈 처리 (점, 느낌표, 물음표)
    #                 if content.endswith((".", "!", "?")):
    #                     content += '\n'

    #                 print(content, end="", flush=True)
    #                 context["full_response"] += content
    #                 yield content.encode("utf-8")
    #                 await asyncio.sleep(0.05)
    #     except Exception as e:
    #         print(f"🔌 스트림 오류: {e}")
    #         yield f"\n\n[오류 발생: {str(e)}]\n\n".encode("utf-8")
    #     finally:
    #         print("🔌 연결 종료", context["full_response"])
