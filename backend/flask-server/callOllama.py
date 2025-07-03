from flask import Response, jsonify
import requests
import json
import time
from openai import OpenAI

OLLAMA_URL = "http://localhost:11434/api/generate" # Ollama API 서버
MODEL_NAME = "gemma:2b" # 설치한 모델 이름 > mistral, gemma:2b,  등
cache = {} # 캐시 저장소 (질문 > 응답)
headers = {
    "Content-Type": "text/event-stream", # 스트리밍 데이터임을 명시 (SSE 등)
    "X-Accel-Buffering": "no",  # Nginx의 응답 버퍼링 방지
    "Cache-Control": "no-cache, no-transform", # 캐시 방지 + 중간 장치가 내용 변경하지 못하도록 함
    "Transfer-Encoding": "chunked",  # 응답을 chunk 단위로 전송 (전체 크기 없이도 가능)
    "Connection": "keep-alive" # 연결 유지 → 스트림 연결 유지
}

def stream_prompt_to_ollama(data):
    question = data['question']

    if not data or "question" not in data:
        return jsonify({"error": "Missing question field"}), 400
    
    if question.strip() in cache:
        # ✅ 캐시에서 가져옴
        return Response(cache[question.strip()], content_type='text/plain')
    
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
            cache[question] = full_response
            print('full_response', full_response)
        
        except Exception as e:
            print("error!!!!!!!!!")
            return jsonify({"error": str(e)}), 500   
    return Response(generate(), headers=headers, direct_passthrough=True)

# Ollama를 OpenAI 라이브러리로 사용하기 위한 설정
client = OpenAI(
    base_url = 'http://localhost:11434/v1', # Ollama 서버 주소
    api_key='ollama', # required, but unused
)

def chat_completion_with_ollama(question):

    if question in cache:
        return jsonify({"response": cache[question]})
    
    # 메시지 구성: system + user
    messages = [
        # {"role": "system", "content": "You are a math teacher. Please solve the problem step by step."},
        {"role": "system", "content": "한국어로 풀어줘."},
        {"role": "user", "content": question}
    ]
    print("messages", messages)
    def generate():
        try:
            # ChatCompletion API 호출 (Ollama를 OpenAI 라이브러리처럼 사용)
            response = client.chat.completions.create(
                model=MODEL_NAME, # "wizard-math", MODEL_NAME
                messages=messages,
                stream=True  # 실시간 응답 (streaming)
            )

            full_response = ''
            for chunk in response:
                content = chunk.choices[0].delta.content or ""
                if (content):
                    # print(content, end="", flush=True)  # 실시간 출력
                    full_response += content
                    yield content.encode('utf-8')
                    time.sleep(0.1)

            cache[question] = full_response

        except Exception as e:
            print("error!!!!!!!!!", str(e))
            return jsonify({"error": str(e)}), 500
        
    return Response(generate(), headers=headers, direct_passthrough=True)

def stream_translate(question, answer):

    response = client.chat.completions.create(
        model="gemma:2b", # mistral, gemma:2b,
        messages=[{"role": "user", "content": f"Translate to Korean:\n{answer}"}],
        stream=True
    )

    print("ㄹ너댜ㅣ러", response)

    full_response = ''
    for chunk in response:
        content = chunk.choices[0].message or ""
        if (content):
            # print('CONTENT', content, end="", flush=True)  # 실시간 출력
            full_response += content
            yield content.encode('utf-8')
            time.sleep(0.1)

    cache[question] = full_response

    print("????", response.choices[0].message)