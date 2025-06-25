from flask import Flask, request, jsonify
from flask_cors import CORS
from callOllama import call_ollama_api
from extract import extract_text, extract_expression
from calculator import process_sympy_expr

app = Flask(__name__)
CORS(app)  # React와의 CORS 문제 해결

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    return call_ollama_api(data)

@app.route("/extract-text", methods=["POST"])
def extract():
    # 첨부파일 확인
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    text = extract_text(file)
    print(text)
    return jsonify({'text': text})

@app.route("/calc", methods=["POST"])
def calc():
    tex = r"f(x)=e^{2 x+1}"
    # tex = r"x^2-16 x+48=0"
    # tex = r"\frac{4}{3^{-2}+3^{-3}}"
    # tex = r"\frac{d}{dx}(x^{2}+x)"
    a = latex_to_sympy(tex)
    b = latex_to_latex(tex)
    print('aaaaa', a)
    print('bbbbb', b)

@app.route("/ask/file", methods=["POST"])
def predict():
    # 첨부파일 확인
    if 'file' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['file']
    latex_code = extract_expression(file)
    print('>> latex_code', latex_code)
    return process_sympy_expr(latex_code)


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True, threaded=True)