from flask import Response, jsonify, make_response
import requests
import json
import time
from openai import OpenAI
from dbConnect import save_chat
from datetime import datetime, timezone

OLLAMA_URL = "http://localhost:11434/api/generate" # Ollama API 서버
MODEL_NAME = "gemma:2b" # 설치한 모델 이름 > mistral, gemma:7b, wizard-math 등
headers = {
    "Content-Type": "text/event-stream", # 스트리밍 데이터임을 명시 (SSE 등)
    "X-Accel-Buffering": "no",  # Nginx의 응답 버퍼링 방지
    "Cache-Control": "no-cache, no-transform", # 캐시 방지 + 중간 장치가 내용 변경하지 못하도록 함
    "Transfer-Encoding": "chunked",  # 응답을 chunk 단위로 전송 (전체 크기 없이도 가능)
    "Connection": "keep-alive" # 연결 유지 → 스트림 연결 유지
}

# prompt 방식
def stream_prompt_to_ollama(data):
    question = data['question']

    if not data or "question" not in data:
        return jsonify({"error": "Missing question field"}), 400
    
    # 🔄 Ollama로 요청 보내기
    def generate():
        try:
            full_response = ''
            # with 구문: 컨텍스트 매니저 구문 > 자원(파일, 네트워크 연결 등)을 열고 자동으로 닫아주는 문법
            # 자원 관리 자동화: 열었던 자원을 명시적으로 닫지 않아도 자동으로 닫힘
            # 에러 발생 시에도 안전: 예외가 발생해도 with 블록이 끝나면 정리됨
            # with requests.post(...) as res:
            #   requests.post(...)는 내부적으로 HTTP 연결을 엶
            #   res 객체는 응답 스트림을 담고 있음
            #   with 블록을 빠져나가면 res.close()가 자동 호출되어 네트워크 자원이 해제됨
            with requests.post(OLLAMA_URL, json={
                "model": "",
                "prompt": f"{question}\n한국어로 대답해줘",
                "stream": True # Ollama 서버에서 데이터를 실시간 조각으로 응답
            }, stream=True) as response:
                for line in response.iter_lines(): # 줄 단위로 응답을 실시간 파싱
                    if line:
                        chunk = json.loads(line.decode('utf-8')) # 한 줄 JSON 파싱
                        response_piece = chunk.get("response", "")
                        full_response += response_piece
                        yield (response_piece).encode('utf-8')
                        time.sleep(0.1)
                        # yield: 받은 응답 조각을 하나씩 클라이언트로 전송
                        # chunk.get("response", ""): 텍스트 조각만 추출

            # 생성 완료 후 캐시에 저장
            print('full_response', full_response)
        
        except Exception as e:
            print("error!!!!!!!!!")
            return jsonify({"error": str(e)}), 500   
    return Response(generate(), headers=headers, direct_passthrough=True)

# Ollama를 OpenAI 라이브러리로 사용하기 위한 설정
client = OpenAI(
    base_url = "http://localhost:11434/v1", # Ollama 서버 주소
    # base_url = 'http://localhost:11434/v1/chat/completions', # Ollama 서버 주소
    api_key="ollama", # required, but unused
)

# completion 방식
# - 역할 기반 대화 가능, 문맥 유지 가능
# - CoT(Chain-of-Thought) == 논리적인 추론 단계를 하나씩 서술하는 데에 유리
def chat_completion_with_ollama(question, chat_meta, stream=True):
    # print("chat_meta", chat_meta)
    # 메시지 구성: system + user
    messages = [
        # {"role": "system", "content": "You are a math teacher. Please solve the problem step by step."},
        # {"role": "system", "content": "단계별로 간단히 한국어로 풀어줘."},
        {"role": "system", "content": "간단히 한국어로 설명해줘."},
        {"role": "user", "content": question}
    ]
    print('chat_completion_with_ollama', messages)

    context = { "full_response": "" }
    # Generator
    # iterator를 생성해주는 함수
    # 일반 함수에서 return 대신 yeild를 사용하면 generator가 됨
    # yeild가 작동될 값을 순차적으로 산출
    # 즉, 값을 한 번에 반환하지 않고, 필요할 때마다 값을 '생상'하여 반환
    # (iterator는 `__iter__()`와 __next__() 메서드를 통해 순회 가능한 객체)
    def generate():
        try:
            print('시작!')
            # ChatCompletion API 호출 (Ollama를 OpenAI 라이브러리처럼 사용)
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                stream=stream  # 실시간 응답 (streaming)
            )
            print('응답하라!!', response)
            for chunk in response:
                content = chunk.choices[0].delta.content or ""
                if (content):
                    # print(content, end="", flush=True)  # 실시간 출력
                    context["full_response"] += content
                    yield content.encode("utf-8")
                    time.sleep(0.05)
                    # time.sleep()이 필요한 이유 (0.05 ~ 0.1 정도가 좋음)
                    # 브라우저 렌더링 시간 확보 > chunk 사이의 시간을 확보하여 보다 더 안정적으로 표시할 수 있도록
                    # 서버 부하 분산 & CPU 점유율 낮춤 > 응답이 너무 빨리 돌면 서버는 계속 루프를 돌면서 CPU를 많이 점유하게 됨
        except Exception as e:
            print("💡 에러 발생 >", str(e))
            # yield f"\n[서버 오류]: {str(e)}\n"
            return jsonify({"error": str(e)}), 500
        finally:
            print("🔌 연결 종료")

    # 스트리밍 완료 후 DB에 저장
    def response_wrapper():
        try:
            yield from generate()
            chat_data = {
                "chatId": chat_meta.get("chatId"),
                "userId": "user1", # chat_meta.get("userId")
                "title": chat_meta.get("title", "newChat"),
                "titleIsLatex": False,
                "messages": transform_messages(messages, context["full_response"])
            }
            save_chat(chat_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return Response(response_wrapper(), headers=headers, direct_passthrough=True)


def transform_messages(messages, answer):
    now = datetime.now(timezone.utc)
    # messages에서 role이 user인 항목만 추출,
    user_messages = [
        {
            "role": msg["role"],
            "content": msg["content"],
            "createdAt": now,
            "isLatex": False
        }
        for msg in messages if msg["role"] == "user"
    ]
    # assistant 메시지 추가
    assistant_message = {
        "role": "assistant",
        "content": answer,
        "createdAt": now,
        "isLatex": False
    }
    return user_messages + [assistant_message]



def stream_translate(question, answer):

    response = client.chat.completions.create(
        model="gemma:2b", # mistral, gemma:2b,
        messages=[{"role": "user", "content": f"Translate to Korean:\n{answer}"}],
        stream=True
    )

    full_response = ''
    for chunk in response:
        content = chunk.choices[0].message or ""
        if (content):
            # print('CONTENT', content, end="", flush=True)  # 실시간 출력
            full_response += content
            yield content.encode('utf-8')
            time.sleep(0.1)