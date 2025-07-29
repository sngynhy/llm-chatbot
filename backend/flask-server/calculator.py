from fractions import Fraction
from sympy import simplify, symbols, Eq, solve
# from latex2sympy2 import latex2sympy, latex2latex

def process_sympy_expr(expr):
    try:
        print('>> 식: ', expr, ', 타입: ', type(expr))
        print(simplify(expr))

        if isinstance(expr, list):
            results = [process_single_expr(e) for e in expr]
            print("여기양", results)
            return "\n".join(results)
        else:
            print("저기양")
            return process_single_expr(expr)
    except Exception as e:
        print('🔔 오류 발생')
        return f"[ERROR] 수식을 처리할 수 없습니다: [{expr}], {str(e)}"

def process_single_expr(expr):
    print('🎈🎈 process_single_expr')
    # 방정식
    if isinstance(expr, Eq):
        print("[방정식 풀이]")
        result = solve(expr)
        return f"[방정식 풀이] {expr} → 해: {result}"

    # 도함수 (미분)
    elif isinstance(expr, Derivative):
        print("[미분 결과]")
        result = expr.doit()
        return f"[미분 결과] {expr} → {result}"

    # 적분
    elif isinstance(expr, Integral):
        print("[적분 결과]")
        result = expr.doit()
        return f"[적분 결과] {expr} → {result}"

    # 부등식 (예: x > 1)
    elif isinstance(expr, Relational):
        print("[부등식 표현]")
        return f"[부등식 표현] {expr}"

    # 일반 수식
    elif isinstance(expr, Expr):
        print("[단순 수식]")
        simplified = simplify(expr)
        return f"[단순 수식] {expr} → {simplified}"

    else:
        return f"[알 수 없는 표현식 타입] {expr}"

# def latex_to_latex(latex):
#     return latex2latex(latex)