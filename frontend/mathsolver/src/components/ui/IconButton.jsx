import React from "react";
import styled from "styled-components";

function IconButton ({onClick, children, type='button', size=24, color='black', disabled=false}) {
    return (
        <Button onClick={onClick} type={type} $size={size} $color={color} disabled={disabled}>
            {children}
        </Button>
    )
}

// 아이콘 버튼
const Button = styled.button`
    cursor: pointer;
    display: flex;
    align-items: center;
    border: none;
    background-color: transparent;

    &:disabled {
        & > svg {
            color: gray;
            cursor: auto;
        }
    }
    
    & > svg {
        width: ${props => props.$size}px;
        height: ${props => props.$size}px;
        color: ${props => props.$color};
    }
`
export default IconButton
