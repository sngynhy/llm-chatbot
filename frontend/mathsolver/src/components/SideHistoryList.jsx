import React, { memo, useState } from 'react'
import { useHistoryStore } from 'stores/useHistoryStore'
import { MathExpr } from './content/MathExpr'
import { CgMathPlus } from 'react-icons/cg'
import styled from 'styled-components'
import { IconButton } from './ui/IconButton'
import { Link } from 'react-router-dom'

export const SideHistoryList = memo(({ chatMatch, currentchatId, chatTitles, removeSubmit }) => {
    // console.log('SideHistoryList', currentchatId);
    const [hoveredId, setHoveredId] = useState(null)
    const { setCurrentchatId } = useHistoryStore()

    return (
        <Ul style={styles.ul} $borderTop={chatTitles.length > 0}>                
            {chatTitles.map(item => {
                const isHovered = hoveredId === item.chatId
                const isSelected = Boolean(chatMatch) && currentchatId === item.chatId

                return (
                    <Li
                        key={item.chatId}
                        $selected={isSelected}
                        style={styles.li}
                        onMouseEnter={() => setHoveredId(item.chatId)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* <Link to={`/chat/${item.chatId}`} state={{ initialAsk: false }} onClick={() => setCurrentchatId(item.chatId)}> */}
                        <Link to={`/chat/${item.chatId}`} state={{ initialAsk: false }}>
                            {!item.isLatex ? <div className="title">{item.title}</div> : <MathExpr latex={item.title} />}
                        </Link>
                        
                        {isHovered && <IconButton size={20} color='gray' onClick={() => removeSubmit(item.chatId)}><CgMathPlus style={{transform: 'rotate(45deg)'}}/></IconButton>}
                    </Li>
                )
            })}
        </Ul>
    )
})

const styles = {
    ul: {
        listStyle: 'none',
        cursor: 'pointer',
        padding: 0,
        margin: 0
    },
    li: {
        padding: '12px 20px',
        fontSize: '14px',
        height: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        width: 'calc(100% - 40px)',
        whiteSpace: 'nowrap'
    }
}
const Ul = styled.ul`
    ${props => props.$borderTop && 'border-top: 1px solid rgb(234, 236, 238);'}
    
    & > div > a {
        text-decoration: none;
        display: flex;
        gap: 8px;
    }
`
const Li = styled.li`
    padding: 12px 0;
    border-radius: 12px;
    display: flex;
    gap: 8px;
    color: ${props => props.$selected ? 'black' : 'rgb(59, 59, 59)'};
    width: 100%;
    ${props => props.$selected && 'font-weight: 500;'}

    &:hover {
        background-color: #f3f5f7; // #f7f7f7;
    }

    & > a {
        color: ${props => props.$selected ? 'black' : 'rgb(59, 59, 59)'};
        text-decoration: none;
        width: 100%;
    }
`