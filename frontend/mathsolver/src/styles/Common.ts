import styled from "styled-components";

export const mainColor = "#007aff";
export const mainBackColor = "#f3f5f7";

interface ChatContainerProps {
  $isNewChat: boolean;
}

export const ChatContainer = styled.div<ChatContainerProps>`
  display: flex;
  flex-direction: column;
  padding: 0 18rem; // 0 1rem; mb 버전
  gap: 1rem;
  ${(props) => props.$isNewChat && "height: 75%;"}
  ${(props) => props.$isNewChat && "justify-content: center;"}
    
    & > h1 {
    font-weight: 400;
    text-align: center;
    margin: 2rem 0;
  }

  & > #question {
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
