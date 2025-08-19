from datetime import datetime, timezone
from openai import AsyncOpenAI
from app.config import settings
import asyncio
import time

MODEL_NAME = "gemma:2b" # mistral, gemma:7b, wizard-math

class ChatStreamService:
    def __init__(self, ollama_client: AsyncOpenAI):
        self.client = ollama_client

    async def stream(self, question: str):
        # print('stream', question)
        messages = [
            {"role": "system", "content": "간단히 한국어로 설명해줘."},
            {"role": "user", "content": question},
        ]

        context = {"full_response": ""}

        try:
            stream = await self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                stream=True,
                # temperature=0.7,
                # max_tokens=1000,
            )
            async for event in stream:
                chunk = getattr(event, "chunk", event)
                if not hasattr(chunk, "choices") or not chunk.choices:
                    continue

                content = chunk.choices[0].delta.content or ""
                if not content:
                    continue

                # 문장 끝 기호들 감지하여 줄바꿈 처리 (점, 느낌표, 물음표)
                if content.endswith((".", "!", "?")):
                    content += '\n'

                # print(content, end="", flush=True)
                context["full_response"] += content
                yield content.encode("utf-8")
                await asyncio.sleep(0.05)

        except Exception as e:
            print(f"🔌 스트림 오류: {e}")
            yield f"\n\n[오류 발생: {str(e)}]\n\n".encode("utf-8")
        finally:
            # 스트림 객체가 존재하면 닫기 시도
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
            print("🔌🔌 연결 종료", context["full_response"])

    def set_messages(prompt, answer):
        now = datetime.now(timezone.utc)
        user_messages = [
            {
                "role": "user",
                "content": prompt,
                "createdAt": now,
                "isLatex": False
            }
        ]
        assistant_message = [
            {
                "role": "assistant",
                "content": answer,
                "createdAt": now,
                "isLatex": False
            }
        ]
        return user_messages + assistant_message


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



    #     # except ClientDisconnect:
    #     #     print("🔌 ClientDisconnect: 스트림 중단 1")
    #     # except ClientDisconnected:
    #     #     print("🔌 ClientDisconnected: 스트림 중단 2")
    #     # except ClientDisconnectedError:
    #     #     print("🔌 ClientDisconnectedError: 스트림 중단 3")
    #     # except asyncio.CancelledError:
    #     #     print("🔌 AsyncIO 취소: 스트림 중단")
    #     except Exception as e:
    #         print(f"🔌 스트림 오류: {e}")
    #         yield f"\n\n[오류 발생: {str(e)}]\n\n".encode("utf-8")
    #     finally:
    #         print("🔌 연결 종료", context["full_response"])
