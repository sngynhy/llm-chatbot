import time
from typing import AsyncGenerator
from openai import OpenAI
from app.config import settings

MODEL_NAME = "gemma:2b" # mistral, gemma:7b, wizard-math

class ChatStreamService:
    def __init__(self):
        self.client = OpenAI(base_url=settings.OLLAMA_BASE_URL, api_key=settings.OLLAMA_API_KEY)

    async def stream(self, question: str) -> AsyncGenerator[str, None]:
        print('stream', question)
        messages = [
            {"role": "system", "content": "간단히 한국어로 설명해줘."},
            {"role": "user", "content": question},
        ]

        # full_response = ""
        # response = None

        # try:
        #     # stream = self.client.chat.completions.create(
        #     #     model=MODEL_NAME,
        #     #     messages=messages,
        #     #     stream=True,
        #     # )

        #     # 비동기로 OpenAI 스트림 생성
        #     response = await asyncio.get_event_loop().run_in_executor(
        #         None, 
        #         lambda: self.client.chat.completions.create(
        #             model=MODEL_NAME,
        #             messages=messages,
        #             stream=True,
        #             temperature=0.7,  # 응답 다양성 조절
        #             max_tokens=1000,  # 최대 토큰 수 제한
        #         )
        #     )

        #     for chunk in response:
        #         # 클라이언트 연결 상태 확인
        #         if request and await self._is_client_disconnected(request):
        #             logging.info("클라이언트 연결 끊김 감지")
        #             break

        #         content = chunk.choices[0].delta.content or ""
        #         if not content:
        #             continue

        #         # 문장 끝 기호들 감지하여 줄바꿈 처리 (점, 느낌표, 물음표)
        #         sentence_endings = ['.', '!', '?']
        #         if any(content.endswith(ending) for ending in sentence_endings):
        #             content += '\n'
        #         # print(content, end="", flush=True)
        #         full_response += content
        #         yield content.encode("utf-8")
        #         time.sleep(0.05)
        # except Exception as e:
        #     print(f"Error: {e}")
        #     return f"Error: {e}"
        # finally:
        #     print("🔌 연결 종료", context["full_response"])
        #     # 현재 요청의 스트림만 닫음 (세션은 재사용)
        #     try:
        #         stream.close()
        #     except Exception:
        #         pass