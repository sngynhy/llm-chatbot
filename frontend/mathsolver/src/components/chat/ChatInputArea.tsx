import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { mainColor, mainBackColor } from "styles/Common";
import { IconButton } from "../ui/IconButton";
import { FilePreview } from "./FilePreview";
import { ScaleLoader } from "react-spinners";
import { MdAttachFile } from "react-icons/md";
import { IoStopCircleSharp } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";

interface ChatInputAreaProps {
  isNewChat: boolean;
  isStreaming: boolean;
  onSubmit: (question: string) => void;
  onFileSubmit: (file: File) => void;
  cancelSubmit: () => void;
}

export const ChatInputArea = ({
  isNewChat,
  isStreaming,
  onSubmit,
  onFileSubmit,
  cancelSubmit,
}: ChatInputAreaProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [isLatex, setIsLatex] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isStreaming) setIsHovered(false);
  }, [isStreaming]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // 파일 선택 초기화 (동일 파일 재선택 허용)
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 스트리밍 중이면 전송 방지
    if (isStreaming) {
      return;
    }

    // 유효성 검사
    if (!file && !question.trim()) {
      inputRef.current?.focus();
      return;
    }

    // 파일 전송
    if (file) {
      onFileSubmit(file);
      setFile(null);
      return;
    }

    // 텍스트 전송
    onSubmit(question);
    setQuestion("");
  };

  return (
    <Conatainer
      id="input-area"
      tabIndex={0}
      style={isNewChat ? undefined : { position: "sticky", bottom: "2rem" }}
      onSubmit={handleSubmit}
    >
      {/* 파일 업로드 */}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" style={{ display: "flex" }}>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <MdAttachFile size={20} />
        </div>
      </label>

      {/* 텍스트 입력 OR 파일 업로드 시 파일 미리보기 */}
      {file ? (
        <FilePreview file={file} onClear={() => setFile(null)} />
      ) : (
        <input
          ref={inputRef}
          value={isStreaming ? "" : question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isStreaming}
          placeholder="질문을 입력하세요"
        />
      )}

      {/* 전송 버튼 OR 스트리밍 중일 때 중지 버튼 */}
      {isStreaming ? (
        <IconButton size={isHovered ? "30px" : "24px"}>
          {isHovered ? (
            <IoStopCircleSharp
              onMouseLeave={() => setIsHovered(false)}
              onClick={cancelSubmit}
            />
          ) : (
            <ScaleLoader
              onMouseEnter={() => setIsHovered(true)}
              width={2}
              height={18}
            />
          )}
        </IconButton>
      ) : (
        <IconButton
          type="submit"
          color={mainColor}
          disabled={!question.trim() && !file}
        >
          <RiSendPlaneFill />
        </IconButton>
      )}
    </Conatainer>
  );
};

const Conatainer = styled.form`
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 12px 20px;
  border-radius: 2rem;
  border: 1px solid lightgray;
  box-shadow: 0 2px 16px 0 #00000008;
  height: 2rem;

  &:focus-within {
    border: 1px solid ${mainColor};
  }

  & > input {
    border: none;
    resize: none;
    width: 100%;
    margin: 0 8px;
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
`;
