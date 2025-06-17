import React from "react";
import styled from "styled-components";

function IconButton ({onClick, children, iconSize=24}) {
    return (
        <Button $iconSize={iconSize} onClick={onClick}>
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
        width: ${props => props.$iconSize}px;
        height: ${props => props.$iconSize}px;
    }
`
export default IconButton
