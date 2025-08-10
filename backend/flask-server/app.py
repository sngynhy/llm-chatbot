from flask import Flask, request, jsonify, g
from flask_cors import CORS
from callOllama import chat_completion_with_ollama
from extract import extract_text_w_easy, extract_expression, preprocess_latex, check_latex_syntax, check_math_meaning
from calculator import process_sympy_expr
from dbConnect import save_chat, get_chat, get_all_chats, get_all_titles, delete_chat
# from sympy import latex
from werkzeug.exceptions import ClientDisconnected
from utils import is_client_connected
import time

app = Flask(__name__)
CORS(app)  # React와의 CORS 문제 해결

# 클라이언트 연결 상태를 추적하는 미들웨어
@app.before_request
def before_request():
    print('요청 처리 전')
    g.start_time = time.time()
    g.client_connected = True

@app.after_request
def after_request(response):
    print('요청 처리 후')
    # 응답 시간 로깅
    if hasattr(g, 'start_time'):
        duration = time.time() - g.start_time
        print(f"요청 처리 시간: {duration:.3f}초")
    return response

# 클라이언트 연결 해제 감지 미들웨어
@app.errorhandler(ClientDisconnected)
def handle_client_disconnect(error):
    print("🔌 클라이언트 연결이 해제되었습니다.", error)
    return "", 499  # Client Closed Request 상태 코드

@app.route("/api/ask", methods=["POST"])
def chat_api():
    try:
        data = request.json

        if not data or "question" not in data:
            return jsonify({"status": "error", "message": "Missing 'question' field"}), 400

        question = data["question"].strip()

        return chat_completion_with_ollama(question, data)
    except ClientDisconnected:
        print("🔌 채팅 API 요청 중 클라이언트 연결이 해제되었습니다.")
        return "", 499
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route("/api/ask/file", methods=["POST"])
def predict():
    print('request', request);
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    image = request.files['image']
    extracted_text = extract_text_w_easy(image)
    return jsonify({'text': extracted_text}) 

@app.route("/api/ask/file/math", methods=["POST"])
def predict_math():
    # 첨부파일 확인
    if 'file' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    # pix2text : 이미지에서 수식 추출
    # 정규표현식 + 룰 기반 전처리 => 쓰레기 토큰 제거, 기초 문법 보정
    # pylatexenc : 문법 체크 => 구조적 오류 탐지 (괄호, 명령어 등)
    # sympy : 의미 해석 가능한지 시도 => 수식 의미 파악 및 계산 가능 여부 검증
    # 가능하면 연산 처리 후 응답
    
    file = request.files['file']
    # 1. 이미지에서 latex 추출
    latex_str = extract_expression(file)
    # print("11111111111 latex_str", latex_str)

    # 2. 전처리
    preprocessed = preprocess_latex(latex_str)
    # print("22222222222 전처리", preprocessed)

    # 3. 문법 검사
    syntax_ok, syntax_err = check_latex_syntax(preprocessed)
    # print('33333333333 문법 검사', syntax_ok, syntax_err)
    if not syntax_ok:
        return jsonify({'status': 'fail', 'step': 'syntax', 'error': syntax_err}), 400

    # 3. 의미 검사
    meaning_ok, meaning_res = check_math_meaning(preprocessed)
    # print('44444444444 의미 검사', meaning_ok, meaning_res)
    if not meaning_ok:
        return jsonify({'status': 'fail', 'step': 'meaning', 'error': meaning_res}), 400

    # 계산 결과
    answer = process_sympy_expr(meaning_res)

    return jsonify({
        'status': 'success',
        # 'latex': latex(meaning_res),
        'latex': preprocessed,
        'parsed_expression': str(meaning_res),
        'answer': answer
    })

# mongoDB 연결
# chat save
@app.route("/api/chat", methods=["POST"])
def save_chat_api():
    try:
        chatData = request.json
        save_chat(chatData)
        return jsonify({"status": "success", "message": f"Chat {chatData.get('chatId')} created"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# chat get by chat_id
@app.route("/api/chat/<chat_id>", methods=["GET"])
def get_chat_api(chat_id):
    try:
        chatData = get_chat(chat_id)
        if not chatData:
            return jsonify({"status": "error", "message": "Chat not found"}), 404
        return jsonify({"status": "success", "data": chatData}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# chat titles get
@app.route("/api/chat/titles", methods=["GET"])
def get_all_titles_api():
    titles = get_all_titles()
    return jsonify(titles)

# all chat get
@app.route("/api/chat", methods=["GET"])
def get_all_chats_api():
    chats = get_all_chats()
    return jsonify(chats)

# chat delete by chat_id
@app.route("/api/chat/<chat_id>", methods=["DELETE"])
def delete_chat_api(chat_id):
    try:
        result = delete_chat(chat_id)
        if result.modified_count == 1:
            return jsonify({"status": "success", "message": f"Chat {chat_id} deleted"}), 200
        else:
            return jsonify({"status": "error", "message": f"Chat {chat_id} not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True, threaded=True)