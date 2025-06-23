import React from 'react'
import styled from 'styled-components'
import { mainColor } from 'styles/Common'

function ChatBubble ({ data }) {
    return (
        <BubbleWrapper>
            {data?.question && <Bubble $isUser={true}>{data.question}</Bubble>}
            {data?.answer && <Bubble $isUser={false}>{data.answer}</Bubble>}
        </BubbleWrapper>
    )
}

const BubbleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
`
const Bubble = styled.pre`
    max-width: 70%;
    align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
    background-color: ${(props) => (props.$isUser ? mainColor : '#f1f1f1')};
    color: ${(props) => (props.$isUser ? 'white' : '#333')};
    padding: 12px 16px;
    border-radius: 20px;
    font-size: 14px;
    line-height: 1.5;
    overflow: auto;
    border-bottom-left-radius: ${(props) => (props.isUser ? '20px' : '0')};
    border-bottom-right-radius: ${(props) => (!props.isUser ? '20px' : '0')};
`
export default ChatBubble
