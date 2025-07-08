from flask import jsonify
import pytesseract
from PIL import Image, ImageFilter, ImageOps
import io
from pix2tex.cli import LatexOCR
import re
from pylatexenc.latexwalker import LatexWalker, LatexWalkerParseError
from sympy.parsing.latex import parse_latex

# 모델 초기화 (최초 1회만 로딩하면 됨)
model = LatexOCR()

# 수식 추출 by LatexOCR (pix2tex)
def extract_expression(file):
    try:
        # 이미지 열기 (RGB로 변환)
        # image = Image.open(file.stream)
        image = Image.open(io.BytesIO(file.read())).convert("RGB")

    except Exception as e:
        return jsonify({"error": f"Invalid image file: {str(e)}"}), 400

    # 모델에 이미지 넣고 LaTeX 수식 추론
    latex_code = model(image)

    return latex_code

# 정규식 기반 전처리 > 쓰레기 토큰 제거 및 수정
def preprocess_latex(latex_str):
    junk_patterns = [
        r'\\mathfrak\{[^}]*\}',
        r'\\protect',
        r'\\ensuremath',
        r'\\operatorname',
        r'\\textstyle',
        r'\\displaystyle',
        r'\\mathrm',
        r'\\mathcal\{[^}]*\}',
        r'\\[&$#@]',
    ]
    for pattern in junk_patterns:
        latex_str = re.sub(pattern, '', latex_str)

    # '\' 중복 제거
    latex_str = latex_str.replace('\\\\', '\\')

    # 불필요한 공백 제거
    latex_str = re.sub(r'\s+', ' ', latex_str).strip()

    return latex_str

# pylatexenc로 문법 검사
def check_latex_syntax(latex_str):
    try:
        walker = LatexWalker(latex_str)
        nodes, pos, len_ = walker.get_latex_nodes()
        return True, None
    except LatexWalkerParseError as e:
        return False, str(e)
    
# sympy로 수학적 의미 검증
def check_math_meaning(latex_str):
    try:
        # sympy의 parse_latex > 복잡한 수식 파싱 시 유용
        expr = parse_latex(latex_str)
        print('?????', expr)

        # 간단한 추가 검사 가능
        # 예: Symbol('x')가 들어가 있는지 등
        return True, expr
    except Exception as e:
        return False, str(e)


# 텍스트 추출 by PaddleOCR
def extract_text_w_paddle(file):
    return ""


pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract"

# 텍스트 추출 by Tesseract
def extract_text(file):
    try:
        # Pillow로 이미지 열고
        image = Image.open(file.stream)

        if image is None:
            return jsonify({'error': 'Inavaild image'}), 400
        
        image = preprocess_image(image)

        # Tesseract로 문자 인지
        text = pytesseract.image_to_string(image, lang='kor+eng')
        return text
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def preprocess_image(image):
    # 그레이스케일 변환
    gray = ImageOps.grayscale(image)
    
    # 대비 증가
    gray = ImageOps.autocontrast(gray)
    
    # 임계값으로 바이너리화 (흑백)
    bw = gray.point(lambda x: 0 if x < 128 else 255, '1')
    
    return bw