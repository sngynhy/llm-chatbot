from flask import Flask, request, jsonify
from flask_cors import CORS
from callOllama import stream_prompt_to_ollama, chat_completion_with_ollama, stream_translate
from extract import extract_text, extract_expression
from calculator import process_sympy_expr

app = Flask(__name__)
CORS(app)  # React와의 CORS 문제 해결

# @app.route("/ask", methods=["POST"])
# def ask():
#     data = request.get_json()
#     return call_ollama_api(data)

@app.route("/ask", methods=["POST"])
def chat():
    data = request.json

    if not data or "question" not in data:
        return jsonify({"error": "Missing 'question' field"}), 400

    question = data["question"].strip()

    # res = chat_completion_with_ollama(data)
    # print(">>> RESPONSE", res)
    # return stream_translate("", "hello nice to meet you")
    return chat_completion_with_ollama(question)
    # return stream_prompt_to_ollama(data)


@app.route("/ask/file", methods=["POST"])
def predict():
    # 첨부파일 확인
    if 'file' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['file']
    latex_code = extract_expression(file)
    print('>> latex_code', latex_code, type(latex_code))
    answer = process_sympy_expr(latex_code)
    print(">>> answer", answer)
    return jsonify({'latex': latex_code, 'answer': answer})


@app.route("/extract-text", methods=["POST"])
def extract():
    # 첨부파일 확인
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    text = extract_text(file)
    print(text)
    return jsonify({'text': text})

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True, threaded=True)