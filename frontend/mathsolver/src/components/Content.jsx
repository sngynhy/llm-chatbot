import React, { useEffect, useRef } from 'react'
import Router from 'router'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { IconButton } from './ui/IconButton';
import { useStyleStore } from 'stores/useStyleStore';
import { LuCopyPlus } from "react-icons/lu";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { ErrorModal } from './ui/ErrorModal';

function Content () {
    const { openSidebar, setOpenSidebar } = useStyleStore()
    return (
        <Container id="content">
            {/* <ErrorModal /> */}
            {!openSidebar && <div id="header">
                <IconButton onClick={() => setOpenSidebar(true)}><TbLayoutSidebarLeftExpand /></IconButton>
                <Link to='/'><IconButton><LuCopyPlus /></IconButton></Link>
            </div>}
            <Router />
        </Container>
    )
}

export default Content

const Container = styled.div`
    margin-left: 0;
    padding: 1rem 0;
    position: relative;
    width: 100%;
    border-radius: 1rem;
    background-color: white;

    & > #header {
        display: flex;
        gap: 12px;
        position: fixed;
        padding: 0 1rem;

        & > a {
            color: black;
        }
    }

    & > #content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        text-align: center;

        & > h1 {
            font-weight: 400;
        }

        & > #question {
            display: flex;
            background-color: white;
            padding: 12px 20px;
            margin: 0 30%;
            border-radius: 2rem;
            border: 1px solid lightgray;
            box-shadow: 0 2px 16px 0 #00000008;
            
            & > input {
                border: none;
                resize: none;
                width: 100%;
            }

            & > input:focus {
                outline: none;
            }

            // & > input::placeholder {
            //     font-size: 16px;
            //     font-family: roboto;
            // }
        }
    }
`