from flask import jsonify
import pytesseract
from PIL import Image, ImageFilter, ImageOps
import io
from pix2tex.cli import LatexOCR

# 모델 초기화 (최초 1회만 로딩하면 됨)
model = LatexOCR()

def extract_expression(file): # 수식 추출 by LatexOCR (pix2tex)
    try:
        # 이미지 열기 (RGB로 변환)
        # image = Image.open(file.stream)
        image = Image.open(io.BytesIO(file.read())).convert("RGB")

    except Exception as e:
        return jsonify({"error": f"Invalid image file: {str(e)}"}), 400

    # 모델에 이미지 넣고 LaTeX 수식 추론
    latex_code = model(image)

    return latex_code


def extract_text_w_paddle(file): # 텍스트 추출 by PaddleOCR
    return ""


pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract"

def extract_text(file): # 텍스트 추출 by Tesseract
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