import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { mainColor, mainBackColor } from 'styles/Common'
import IconButton from '../ui/IconButton'
import { LuSend } from 'react-icons/lu'
import { ScaleLoader } from 'react-spinners'
import { MdAttachFile } from 'react-icons/md'
import { CgMathPlus } from 'react-icons/cg'
import FilePreview from './FilePreview'

export const ChatInputArea = ({
    isNewChat,
    file, setFile,
    isLoading,
    question, setQuestion,
    onSubmit, onFileSubmit,
    inputRef }) => {

    // const [extractedText, setExtractedText] = useState('')

    const handleFileChange = (e) => {
        const input = e.target
        const selectedFile = input.files[0]
        setFile(selectedFile)

        // 파일 선택 초기화 (동일 파일 재선택 허용)
        input.value = ''
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            file ? onFileSubmit(e) : onSubmit(e)
        }
    }

    const onClickSendButton = (e) => {
        file ? onFileSubmit(e) : onSubmit(e)
    }

    return (
        <Conatainer id="input-area" tabIndex={0} style={isNewChat ? undefined : {position: 'sticky', bottom: '1rem'}}>
            <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
            <label htmlFor="fileInput" style={{display: "flex"}}>
                <IconButton size={20}><MdAttachFile /></IconButton>
            </label>

            {file
                ? <FilePreview file={file} onClear={() => setFile(null)} />
                : isNewChat
                    ? <input
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        placeholder='질문을 입력하세요'
                    />
                    : <input
                        ref={inputRef}
                        value={isLoading ? '' : question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder='질문을 입력하세요'
                    />
            }

            {isLoading
                ? <IconButton style={{cursur: 'auto !important'}}><ScaleLoader width={2} height={18} /></IconButton>
                : <IconButton size={20} onClick={onClickSendButton}><LuSend /></IconButton>}
        </Conatainer>
    )
}

const Conatainer = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 12px 20px;
    border-radius: 2rem;
    border: 1px solid lightgray;
    box-shadow: 0 2px 16px 0 #00000008;
    margin: 0 10%;
    height: 2rem;

    &:focus-within {
        border: 1px solid ${mainColor};
    }
    
    & > input {
        border: none;
        resize: none;
        width: 100%;
    }

    & > input:focus {
        outline: none;
    }

    & > #file {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 5px;

        & > span {
            display: flex;
            padding: 5px;
            border-radius: 6px;
            cursor: pointer;
            
            &:hover {
                background-color: ${mainBackColor}
            }

            & > div {
                margin-right: 5px;
            }
        }
    }
`