import React, { forwardRef } from "react";
import styled from "styled-components";
import { mainBackColor, mainColor } from "styles/Common";

interface ChatLayoutProps {
  isNewChat: boolean;
  chatId: string;
  children: React.ReactNode;
}
// forwardRef : ref을 전달하여 상위 DOM을 하위 컴포넌트에서 조작
export const ChatLayout = forwardRef<HTMLDivElement, ChatLayoutProps>(
  ({ isNewChat, chatId, children }, ref) => {
    return (
      <ChatContainer ref={ref} id="chat-container" $isNewChat={isNewChat}>
        {children}
      </ChatContainer>
    );
  }
);

interface ChatContainerProps {
  $isNewChat: boolean;
}

export const ChatContainer = styled.div<ChatContainerProps>`
  width: 40rem;

  ${(props) =>
    props.$isNewChat &&
    `
    height: 75%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
  `}

  & > h1 {
    font-weight: 400;
    text-align: center;
    margin: 2rem 0;
  }

  & > #prompt {
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
          background-color: ${mainBackColor};
        }

        & > div {
          margin-right: 5px;
        }
      }
    }
  }
`;
