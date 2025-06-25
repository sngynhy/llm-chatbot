from fractions import Fraction
from sympy import symbols, Eq, solve
from latex2sympy2 import latex2sympy, latex2latex

def process_sympy_expr(latex_code):
    try:
        expr = latex2sympy(latex_code)
        print('~~~~~~~~~expr', expr, type(expr))
        print("계산 결과:", expr.doit())

        if isinstance(expr, list):
            results = [process_single_expr(e) for e in expr]
            return "\n".join(results)
        else:
            return process_single_expr(expr)
    except Exception as e:
        return f"[ERROR] 수식을 처리할 수 없습니다: {str(e)}"

def process_single_expr(expr):
    # 방정식
    if isinstance(expr, Eq):
        result = solve(expr)
        return f"[방정식 풀이] {expr} → 해: {result}"

    # 도함수 (미분)
    elif isinstance(expr, Derivative):
        result = expr.doit()
        return f"[미분 결과] {expr} → {result}"

    # 적분
    elif isinstance(expr, Integral):
        result = expr.doit()
        return f"[적분 결과] {expr} → {result}"

    # 부등식 (예: x > 1)
    elif isinstance(expr, Relational):
        return f"[부등식 표현] {expr}"

    # 일반 수식
    elif isinstance(expr, Expr):
        simplified = simplify(expr)
        return f"[단순 수식] {expr} → {simplified}"

    else:
        return f"[알 수 없는 표현식 타입] {expr}"

def latex_to_latex(latex):
    return latex2latex(latex)