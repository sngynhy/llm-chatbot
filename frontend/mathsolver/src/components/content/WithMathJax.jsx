import React from 'react'
import { MathJaxContext, MathJax } from 'better-react-mathjax'

// MathJax 객체 설정
const config = {
    // 입력 방식은 latex 수식(tex), 출력은 CHTML(Common HTML) 형식으로 브라우저에 렌더링
  loader: { load: ["input/tex", "output/chtml"] }
}

export const WithMathJax = ({ latex }) => {
    return (
        <MathJaxContext version={3} config={config}>
            <MathJax dynamic>
                {"\\( " + latex + " \\)"}
            </MathJax>
        </MathJaxContext>
    )
}