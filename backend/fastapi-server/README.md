# FastAPI 서버 (병행 마이그레이션)

## 설치

```bash
cd fastapi-server
python -m venv venv
venv/Scripts/activate  # Windows
pip install -r requirements.txt
```

## 실행

```bash
uvicorn app.main:app --reload --port 8000
```

## 엔드포인트

- POST `/api/ask` (SSE)

요청 예시:

```json
{
  "question": "적분이 뭐야?"
}
```

프론트에서 수신 예시(fetch):

```javascript
const res = await fetch("http://localhost:8000/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "질문" }),
});
const reader = res.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}
```

## 클라이언트 취소 감지

- Starlette의 `ClientDisconnect` 예외 처리
- 필요시 비동기 제너레이터 내부에서 `await request.is_disconnected()` 폴링
