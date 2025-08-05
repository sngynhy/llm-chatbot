import React, { memo } from "react";
import styled from "styled-components";
import { mainColor } from "styles/Common";
import { MathExpr } from "components/content/MathExpr";

function ChatBubble({ message }) {
  return (
    <BubbleWrapper>
      <Bubble $isUser={message.role === "user"}>
        {message?.isLatex ? (
          <MathExpr latex={message.content} />
        ) : (
          message.content
        )}
      </Bubble>
    </BubbleWrapper>
  );
}

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 3rem;
  }
`;
const Bubble = styled.pre`
  max-width: 70%;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.$isUser ? mainColor : "#f1f1f1")};
  color: ${(props) => (props.$isUser ? "white" : "#333")};
  //   background-color: ${(props) => (props.$isUser ? "#f1f1f1" : "#ffffff")};
  //   color: black;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-family: roboto;
  line-height: 1.5;
  border-bottom-left-radius: ${(props) => (props.isUser ? "20px" : "0")};
  border-bottom-right-radius: ${(props) => (!props.isUser ? "20px" : "0")};
  white-space: pre-wrap;
`;

export default memo(ChatBubble);
