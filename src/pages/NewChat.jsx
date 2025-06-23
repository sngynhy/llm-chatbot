import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import styled from 'styled-components'
import { LuSend } from "react-icons/lu";
import { MdAttachFile } from "react-icons/md";
import IconButton from 'components/ui/IconButton';
import { useHistoryStore } from 'stores/useHistoryStore';
import { ChatContainer } from 'styles/Common';

function NewChat () {
    const { setNewQuestion, setCurrentSessionId } = useHistoryStore()

    const [file, setFile] = useState(null)
    const [extractedText, setExtractedText] = useState('')
    const navigate = useNavigate();

    // 1. 질문 저장
    // 2. history 페이지로 이동
    // 3. history 페이지에서 백엔드 전송 > 응답
    const handleAsk = (e) => {
        const question = e.target.value
        if (question.trim() === '') return alert('질문을 입력하세요.')

        setNewQuestion(question)
        const id = new Date().getTime()
        setCurrentSessionId(id.toString())
        navigate(`/history/1/${id}`)
    }

    const handleFileChange = (e) => {
        console.log('handleFileChange', e.target.files);
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!file) return

        // setLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/extract-text', {
                method: 'POST',
                body: formData
            })

            if (!response) throw new Error('Server Error')
            
            const data = await response.json()
            setExtractedText(data.text)
        } catch(err) {
            console.error(err)
        } finally {
            // setLoading(false)
        }
    }

    return (
        <ChatContainer style={{justifyContent: 'center'}}>
            <h1>무엇이든 질문해보세요!</h1>
            <div id="question" tabIndex={0}>
                <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
                <label htmlFor="fileInput"><IconButton size={20}><MdAttachFile /></IconButton></label>
                
                <input  placeholder='질문을 입력하세요' onKeyDown={(e) => {if (e.key === 'Enter') handleAsk(e)}} />
                <IconButton size={20} onClick={handleAsk}><LuSend /></IconButton>
            </div>
        </ChatContainer>
    )
}

export default NewChat