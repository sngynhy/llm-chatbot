import React, { useEffect, useMemo, useState } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import logo from 'assets/logo.png'
import { LuCopyPlus } from "react-icons/lu";
import { GoStack } from "react-icons/go";
import { LuChartSpline } from "react-icons/lu";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { CgMathPlus } from "react-icons/cg";
import IconButton from 'components/ui/IconButton';
import { useStyleStore } from 'stores/useStyleStore';
import { useHistoryStore } from 'stores/useHistoryStore';
import { WithMathJax } from './content/WithMathJax';

function Sidebar () {
    const [visibleHistory, setVisibleHistory] = useState(true)
    const { openSidebar, setOpenSidebar } = useStyleStore()
    const { currentSessionId, setCurrentSessionId, history, deleteSession } = useHistoryStore()

    const newChatMatch = useMatch('/')
    const graphMatch = useMatch('/graph')
    const historyMatch = useMatch('/history/:initial/:id')
    
    const historySummary = useMemo(() => {
        return Object.values(history)
                    .sort((a, b) => a.sessionId - b.sessionId)
                    .map(({ sessionId, title }) => ({
                        id: sessionId,
                        title
                    }))
    }, [history])

    const navigate = useNavigate();
    const removeChatSession = (id) => {
        deleteSession(id)
        navigate('/')
    }

    return (
        <Aside $openSidebar={openSidebar}>
            <div className="header">
                <Link to="/">
                    <img src={logo} alt="로고 아이콘" />
                </Link>
                <IconButton onClick={() => setOpenSidebar(false)}><TbLayoutSidebarLeftCollapse /></IconButton>
            </div>
            <Ul style={styles.ul}>
                <Link to='/'>
                    <List $selected={Boolean(newChatMatch)}>
                        <IconButton size={20}><LuCopyPlus /></IconButton>새 질문
                    </List>
                </Link>
                <Link to='/graph'>
                    <List $selected={Boolean(graphMatch)}>
                        <IconButton size={20}><LuChartSpline /></IconButton>그래프 그리기
                    </List>
                </Link>
                {/* <li><IoSearch />채팅 검색</li> */}
                <a href="undefined" onClick={(e) => {e.preventDefault(); if (historySummary?.length > 0) setVisibleHistory(prev => !prev);}}>
                    <List $selected={Boolean(historyMatch)}>
                        <IconButton size={20}><GoStack /></IconButton>질문 내역
                    </List>
                </a>
                {visibleHistory && <Ul style={styles.ul}>
                    {historySummary?.map(item => {
                        return (
                            <List key={item.id} $selected={Boolean(historyMatch) && currentSessionId === item.id} style={styles.li}>
                                <Link to={`/history/0/${item.id}`} onClick={() => setCurrentSessionId(item.id)}>
                                    {/* <div>{item.title}</div> */}
                                    {!item.isLatex ? <div>{item.title}</div> : <WithMathJax latex={item.title} />}
                                </Link>
                                <IconButton size={20} color='gray' onClick={() => removeChatSession(item.id)}><CgMathPlus style={{transform: 'rotate(45deg)'}}/></IconButton>
                            </List>
                        )
                    })}
                </Ul>}
            </Ul>
        </Aside>
    )
}

export default Sidebar

const styles = {
    ul: {
        listStyle: 'none',
        cursor: 'pointer',
        padding: 0
    },
    li: {
        padding: '12px 20px',
        fontSize: '14px',
        height: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        width: 'calc(100% - 40px)'
    }
}

const Aside = styled.aside`
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-shrink: 0;
    padding: ${props => props.$openSidebar ? '0 1rem' : 0};
    width: ${props => props.$openSidebar ? '240px' : "0px"};
    height: 100%;
    position: relative;
    background-color: white;
    box-shadow: 0 2px 16px 0 #00000008;
    transform: ${props => props.$openSidebar ? 'translateX(0)' : "translateX(-104%)"};
    // transition: transform .7s ease-in-out;
    overflow: auto;

    & > .header {
        padding: 1rem 0 0;
        display: flex;
        justify-content: space-between;

        & > a > img {
            width: 6rem;
            height: 3rem;
        }
    }
`
const Ul = styled.ul`
    & > a {
        text-decoration: none;
        display: flex;
        gap: 8px;

        & > svg {
            width: 20px;
            height: 20px;
        }
    }
`

const List = styled.li`
    padding: 12px 10px;
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