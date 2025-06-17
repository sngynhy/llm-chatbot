import React, { useState } from 'react'

function AskLLM() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAsk = () => {
        setAnswer('')
        setLoading(true)

        fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question }),
        })
        .then(async (response) => {
            const reader = response.body.getReader()            
            const decoder = new TextDecoder('utf-8')
            let partial = ''
            
            setLoading(false)
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                // partial += decoder.decode(value, { stream: true })
                // console.log('partial', partial);
                const res = decoder.decode(value, { stream: true })
                                    // .replace(/\n/g, '')

                console.log('res', res);
                setAnswer(prev => prev + res)
            }
        })
        .catch(err => setAnswer('에러 발생: ' + err.message))
        .finally(setQuestion(''))             
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>질문하기</h2>
                <textarea
                    rows="3"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="질문을 입력하세요"
                    style={{ width: '100%', marginBottom: '10px' }}
                />
            <button onClick={handleAsk} disabled={loading}>
                {loading ? '답변 생성 중...' : '질문하기'}
            </button>
            <div style={{ marginTop: 20 }}>
                <h3>답변</h3>
                <pre>{answer}</pre>
            </div>
        </div>
  )
}

export default AskLLM