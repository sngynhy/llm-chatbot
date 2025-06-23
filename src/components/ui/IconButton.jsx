import React from "react";
import styled from "styled-components";

function IconButton ({onClick, children, size=24}) {
    return (
        <Button $size={size} onClick={onClick}>
            {children}
        </Button>
    )
}

// 아이콘 버튼
const Button = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    
    & > svg {
        width: ${props => props.$size}px;
        height: ${props => props.$size}px;
    }
`
export default IconButton
