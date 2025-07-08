import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { mainColor, mainBackColor } from 'styles/Common'
import IconButton from '../ui/IconButton'
import { LuSend } from 'react-icons/lu'
import FilePreview from './FilePreview'
import { ScaleLoader } from 'react-spinners'
import { MdAttachFile } from 'react-icons/md'
import { IoStopCircleSharp } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";

export const ChatInputArea = ({
    isNewChat,
    file, setFile,
    isLoading,
    question, setQuestion,
    onSubmit, onFileSubmit,
    cancelSubmit,
    inputRef }) => {

    // const [extractedText, setExtractedText] = useState('')
    const [isHovered, setIsHovered] = useState(false)

    const handleFileChange = (e) => {
        const input = e.target
        const selectedFile = input.files[0]
        setFile(selectedFile)

        // 파일 선택 초기화 (동일 파일 재선택 허용)
        input.value = ''
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            // 파일 선택 초기화 (동일 파일 재선택 허용)
            e.target.value = null
            onFileSubmit()
        } else {
            onSubmit()
        }
    }

    return (
        <Conatainer id="input-area" tabIndex={0} onSubmit={handleSubmit} style={isNewChat ? undefined : {position: 'sticky', bottom: '1rem'}}>
            <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange} />
            <label htmlFor="fileInput" style={{display: 'flex'}}>
                <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}><MdAttachFile size={20} /></div>
            </label>

            {file
                ? <FilePreview file={file} onClear={() => setFile(null)} />
                : <input
                    ref={inputRef}
                    value={isLoading ? '' : question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                    placeholder='질문을 입력하세요'
                />
            }

            {isLoading
                ? <IconButton size={isHovered ? 30 : 24} style={{cursur: 'auto !important'}}>
                    {isHovered
                        ? <IoStopCircleSharp onMouseLeave={() => setIsHovered(false)} onClick={cancelSubmit} />
                        : <ScaleLoader onMouseEnter={() => setIsHovered(true)} width={2} height={18} />
                    }
                </IconButton>
                : <IconButton type="submit" color={mainColor} disabled={!question.trim() && !file}>
                    <RiSendPlaneFill />
                </IconButton>
            }
        </Conatainer>
    )
}

const Conatainer = styled.form`
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
            background-color: ${mainBackColor};
            
            // &:hover {
            //     background-color: ${mainBackColor};
            // }

            & > div {
                margin-right: 5px;
            }
        }
    }
`