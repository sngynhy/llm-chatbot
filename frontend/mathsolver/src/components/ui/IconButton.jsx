import React from "react";
import styled from "styled-components";

function IconButton ({onClick, children, size=24, color='black'}) {
    return (
        <Button $size={size} $color={color} onClick={onClick}>
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
        color: ${props => props.$color}
    }
`
export default IconButton
