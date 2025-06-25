import React, { useState, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { LuSend } from "react-icons/lu";
import { MdAttachFile } from "react-icons/md";
import IconButton from 'components/ui/IconButton';
import { useHistoryStore } from 'stores/useHistoryStore';
import { ChatContainer } from 'styles/Common';
import { CgMathPlus } from 'react-icons/cg';
import { ScaleLoader, BeatLoader } from "react-spinners";

function NewChat () {
    const { setNewQuestion, setCurrentSessionId } = useHistoryStore()

    const [file, setFile] = useState(null)
    const [extractedText, setExtractedText] = useState('')
    const navigate = useNavigate();
    const inputRef = useRef(null)

    const [isLoading, setIsLoading] = useState(false)

    const handleAsk = (e) => {
        const question = e.target.value
        if (file) return handleSubmit(e)
        if (question === undefined) {
            return inputRef.current.focus()
        }

        setNewQuestion(question)
        const id = new Date().getTime()
        setCurrentSessionId(id.toString())
        navigate(`/history/1/${id}`)
    }

    const handleFileChange = (e) => {
        console.log('handleFileChange', e.target.files);
        const input = e.target
        const selectedFile = input.files[0]
        setFile(selectedFile)

        // 파일 선택 초기화 (동일 파일 재선택 허용)
        input.value = ''
    }

    const handleSubmit = async (e) => {
        console.log('handleSubmit', );
        e.preventDefault()

        if (!file) return

        // setLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        setFile(null)
        // 파일 선택 초기화 (동일 파일 재선택 허용)
        e.target.value = null

        try {
            // const response = await fetch('/extract-text', {
            const response = await fetch('/test', {
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
                <label htmlFor="fileInput" style={{display: "flex"}}><IconButton size={20}><MdAttachFile /></IconButton></label>
                
                {file
                    ? <div id="file">
                        <span onClick={() => setFile(null)}>
                            <div>{file.name}</div>
                            <IconButton size={15} color='gray'><CgMathPlus style={{transform: 'rotate(45deg)'}}/></IconButton>
                        </span>
                    </div>
                    : <input
                        ref={inputRef}
                        onKeyDown={(e) => {if (e.key === 'Enter') handleAsk(e)}}
                        disabled={isLoading}
                        placeholder='질문을 입력하세요'
                    />
                }

                {isLoading
                    ? <IconButton style={{cursur: 'auto !important'}}><ScaleLoader width={2} height={18} /></IconButton>
                    : <IconButton size={20} onClick={handleAsk}><LuSend /></IconButton>}
            </div>
            
            <pre>{extractedText}</pre>
        </ChatContainer>
    )
}

export default NewChat