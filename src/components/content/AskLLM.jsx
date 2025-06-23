import React, { useEffect, useRef, useState } from 'react'
import { LuSend } from "react-icons/lu";
import { MdAttachFile } from "react-icons/md";
import IconButton from '../ui/IconButton';
import useLoading from 'hooks/useLoading';
import { useHistoryStore } from 'stores/useHistoryStore';
import ChatBubble from 'components/ui/ChatBubble';
import { ChatContainer } from 'styles/Common';

function AskLLM() {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const { history, addHistory } = useHistoryStore()

    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
          console.log("👋 최초 렌더링입니다!")
          isFirstRender.current = false; // 이후부터는 false
        } else {
          console.log("🔄 업데이트 렌더링입니다.")
        }
    });

    // 📍 custom hook 사용
    const { isLoading, activeLoading, deactiveLoading } = useLoading();

    const handleAsk = () => {
        if (isLoading) return
        if (question.trim() === '') return alert('질문을 입력하세요')
        const questionCopy = question
        
        setQuestion('')
        setAnswer('')
        activeLoading()
            
        fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: questionCopy }),
        })
        .then(async (response) => {
            const reader = response.body.getReader()            
            const decoder = new TextDecoder('utf-8')
            let partial = ''
            
            deactiveLoading()
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                // partial += decoder.decode(value, { stream: true })
                // console.log('partial', partial);
                const res = decoder.decode(value, { stream: true })
                                    // .replace(/\n/g, '')
                setAnswer(prev => prev + res)
                
            }
            addHistory({ question: questionCopy, answer: answer, timestamp: new Date().getTime()})
        })
        .catch(err => setAnswer('에러 발생: ' + err.message))    
    }

    return (
        <div id="content">
            {/* {chatDataRef.current.map(item => <ChatBubble key={item} data={item} />)}
            {answer && <ChatBubble data={{question: '', answer: answer, timestamp: ''}} />} */}
        </div>
    )
}

export default AskLLM