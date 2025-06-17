import React, { useState } from 'react'
import styled from 'styled-components'
import logo from 'assets/logo.png'
import { LuCopyPlus } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { GoStack } from "react-icons/go";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { LuChartSpline } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import IconButton from 'components/ui/IconButton';
import { useStyleStore } from 'stores/styleStore';

function Sidebar () {
    const [visibleHistory, setVisibleHistory] = useState(true)
    const { openSidebar, setOpenSidebar } = useStyleStore()

    return (
        <div>
            <Aside $openSidebar={openSidebar}>
                <div className="header">
                    <a href="/main" className="logo">
                        <img src={logo} alt="로고 아이콘" />
                    </a>
                    <IconButton onClick={() => setOpenSidebar(false)}><TbLayoutSidebarLeftExpand /></IconButton>
                </div>
                <div>
                    <ul style={styles.ul}>
                        <li><LuCopyPlus />질문하기</li>
                        <li><LuChartSpline />그래프 그리기</li>
                        {/* <li><IoSearch />채팅 검색</li> */}
                        <li onClick={() => setVisibleHistory(prev => !prev)}><GoStack />질문 내역</li>
                        {visibleHistory && <ul style={styles.ul}>
                            <li style={{paddingLeft: '40px'}}>질문1</li>
                            <li style={{paddingLeft: '40px'}}>질문1</li>
                            <li style={{paddingLeft: '40px'}}>질문1</li>
                        </ul>}
                    </ul>
                </div>
            </Aside>
        </div>
    )
}

export default Sidebar

const styles = {
    ul: {
        listStyle: 'none',
        cursor: 'pointer',
        padding: 0
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

    & > .header {
        padding: 1rem 0 0;
        display: flex;
        justify-content: space-between;

        & > a > img {
            width: 6rem;
            height: 3rem;
        }
    }

    & > div > ul {
        & > li {
            padding: 12px 10px;
            border-radius: 12px;
            display: flex;
            gap: 8px;

            & > svg {
                width: 20px;
                height: 20px;
            }
        }
        
        & > li:hover {
            background-color: #f3f5f7; // #f7f7f7;
        }
    }
`