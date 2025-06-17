import React, { useState } from 'react'
import styled from 'styled-components'
import { LuSend } from "react-icons/lu";
import IconButton from './ui/IconButton';
import { useStyleStore } from 'stores/styleStore';
import { LuCopyPlus } from "react-icons/lu";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

function Contents () {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('무엇이든 질문해보세요!')
    const { openSidebar, setOpenSidebar } = useStyleStore()

    const handleAsk = () => {
        if (question.trim() === '') alert('질문을 입력하세요')
        
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
        <Container>
            {!openSidebar && <div id="header">
                <IconButton onClick={() => setOpenSidebar(true)}><TbLayoutSidebarLeftCollapse /></IconButton>
                <IconButton><LuCopyPlus /></IconButton>
            </div>}
            <div id="content">
                <h1>{title}</h1>
                <div id="answer">
                    <h3>답변</h3>
                    <pre>{answer}</pre>
                </div>
                <div id="question">
                    <textarea 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder='질문을 입력하세요'
                        />
                    <IconButton onClick={handleAsk}><LuSend /></IconButton>
                </div>
            </div>
        </Container>
    )
}

export default Contents

const Container = styled.div`
    margin-left: 0;
    position: relative;
    width: 100%;
    border-radius: 1rem;
    background-color: white;

    & > #header {
        display: flex;
        gap: 12px;
        padding: 1rem;
    }

    & > #content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        text-align: center;

        & > h1 {
            font-weight: 400;
        }

        & > #question {
            display: flex;
            background-color: white;
            padding: 12px 20px;
            margin: 0 30%;
            border-radius: 2rem;
            border: 1px solid black;
            
            & > textarea {
                border: none;
                resize: none;
                width: 100%;
            }

            & > textarea:focus {
                outline: none;
            }

            & > textarea::placeholder {
                font-size: 16px;
                font-family: roboto;
            }
        }
    }
`