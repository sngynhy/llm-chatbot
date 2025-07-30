import React, { useEffect, useState } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import logo from 'assets/logo.png'
import { LuCopyPlus } from "react-icons/lu";
import { GoStack } from "react-icons/go";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import IconButton from 'components/ui/IconButton';
import { useStyleStore } from 'stores/useStyleStore';
import { useHistoryStore } from 'stores/useHistoryStore';
import { useChatHistory } from 'hooks/useChatHistory';
import { AsideList } from './AsideList';
import { IoSearch } from 'react-icons/io5';

function Sidebar () {
    const [visibleHistory, setVisibleHistory] = useState(true)
    
    const { openSidebar, setOpenSidebar } = useStyleStore()
    const { currentchatId, chatTitles } = useHistoryStore()
    const { actions } = useChatHistory()

    useEffect(() => {
        actions.getChatTitles()
    }, [actions])

    const newChatMatch = useMatch('/')
    const graphMatch = useMatch('/graph')
    const chatMatch = useMatch('/chat/:initialAsk/:chatId')

    const navigate = useNavigate();
    const removeChat = async (chatId) => {
        await actions.removeChat(chatId)
        if (currentchatId === chatId) navigate('/')
    }

    return (
        <Aside $openSidebar={openSidebar}>
            <AsideHeader className="aside-header">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="로고 아이콘" />
                    </Link>
                    <IconButton onClick={() => setOpenSidebar(false)}><TbLayoutSidebarLeftCollapse /></IconButton>
                </div>
                <div className="category">
                    <div>
                        <Link to='/' style={{color: Boolean(newChatMatch) ? 'black' : 'rgb(59, 59, 59)'}}>
                            <IconButton size={20} color={Boolean(newChatMatch) ? 'black' : 'rgb(59, 59, 59)'}><LuCopyPlus /></IconButton>새 질문
                        </Link>
                    </div>
                    {/* <div>
                        <Link to='/graph' style={{color: Boolean(graphMatch) ? 'black' : 'rgb(59, 59, 59)'}}>
                            <IconButton size={20} color={Boolean(graphMatch) ? 'black' : 'rgb(59, 59, 59)'}><LuChartSpline /></IconButton>그래프 그리기
                        </Link>
                    </div> */}
                    <div>
                        <Link to='/' style={{color: 'rgb(59, 59, 59)'}}>
                            <IconButton size={20} color={'rgb(59, 59, 59)'}><IoSearch /></IconButton>채팅 검색
                        </Link>
                    </div>
                    <div>
                        <a href="undefined" style={{color: Boolean(chatMatch) ? 'black' : 'rgb(59, 59, 59)'}} onClick={(e) => {e.preventDefault(); if (chatTitles.length > 0) setVisibleHistory(prev => !prev);}}>
                            <IconButton size={20} color={Boolean(chatMatch) ? 'black' : 'rgb(59, 59, 59)'}><GoStack /></IconButton>질문 내역
                        </a>
                    </div>
                </div> 
            </AsideHeader>

            {visibleHistory && <AsideList chatMatch={chatMatch} currentchatId={currentchatId} chatTitles={chatTitles} removeSubmit={(chatId) => removeChat(chatId)} />}
        </Aside>
    )
}

export default Sidebar

const Aside = styled.aside`
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: ${props => props.$openSidebar ? '0 1rem' : 0};
    width: ${props => props.$openSidebar ? '240px' : "0px"};
    height: 100%;
    position: relative;
    background-color: white;
    box-shadow: 0 2px 16px 0 #00000008;
    transform: ${props => props.$openSidebar ? 'translateX(0)' : "translateX(-104%)"};
    overflow-y: auto;
    overflow-x: hidden;
    // transition: transform .7s ease-in-out;

    scrollbar-color:rgb(234, 236, 238) #fff;
    scrollbar-width: auto; // thin
`
const AsideHeader = styled.div`
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 10;

    & > .logo {
        padding: 1rem 0 1rem;
        display: flex;
        justify-content: space-between;

        & > a > img {
            width: 6rem;
            height: 3rem;
        }
    }

    & > .category {
        padding: 10px 0;
        cursor: pointer;

        & > div {
            padding: 12px;
            border-radius: 12px;

            & > a {
                display: flex;
                gap: 8px;
                text-decoration: none;
                width: 100%;
            }

            &:hover {
                background-color: #f3f5f7;
            }
        }
    }
`