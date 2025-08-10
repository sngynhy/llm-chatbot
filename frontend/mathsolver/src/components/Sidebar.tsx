import React, { useEffect, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "assets/logo/logo.svg";
import { LuCopyPlus } from "react-icons/lu";
import { BsLayoutSidebar } from "react-icons/bs";
import { IconButton } from "components/ui/IconButton";
import { useStyleStore } from "stores/useStyleStore";
import { useHistoryStore } from "stores/useHistoryStore";
import { useChatHistory } from "hooks/useChatHistory";
import { SideHistoryList } from "./SideHistoryList";
import { IoSearch } from "react-icons/io5";
import { mainBackColor } from "styles/Common";

function Sidebar() {
  const { openSidebar, setOpenSidebar } = useStyleStore();
  const { currentchatId, chatTitles } = useHistoryStore();
  const { actions } = useChatHistory();

  useEffect(() => {
    actions.getChatTitles();
  }, []);

  const newChatMatch = useMatch("/");
  const graphMatch = useMatch("/graph");
  const chatMatch = useMatch("/chat/:chatId");

  const navigate = useNavigate();
  const removeChat = async (chatId: string) => {
    await actions.removeChat(chatId);
    if (currentchatId === chatId) navigate("/");
  };

  return (
    <Aside $openSidebar={openSidebar}>
      <AsideHeader className="aside-header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="로고 아이콘" />
          </Link>
          <IconButton
            size={18}
            color="gray"
            style={{ alignItems: "baseline" }}
            hoverStyle={{ color: "black" }}
            onClick={() => setOpenSidebar(false)}
          >
            <BsLayoutSidebar />
          </IconButton>
        </div>
        <div className="menu">
          <div>
            <Link
              to="/"
              style={{
                color: Boolean(newChatMatch) ? "black" : "rgb(59, 59, 59)",
              }}
            >
              <IconButton
                size={20}
                color={Boolean(newChatMatch) ? "black" : "rgb(59, 59, 59)"}
              >
                <LuCopyPlus />
              </IconButton>
              새 질문
            </Link>
          </div>
          {/* <div>
                        <Link to='/graph' style={{color: Boolean(graphMatch) ? 'black' : 'rgb(59, 59, 59)'}}>
                            <IconButton size={20} color={Boolean(graphMatch) ? 'black' : 'rgb(59, 59, 59)'}><LuChartSpline /></IconButton>그래프 그리기
                        </Link>
                    </div> */}
          <div>
            <Link to="/" style={{ color: "rgb(59, 59, 59)" }}>
              <IconButton size={20} color={"rgb(59, 59, 59)"}>
                <IoSearch />
              </IconButton>
              채팅 검색
            </Link>
          </div>
        </div>
      </AsideHeader>

      <SideHistoryList
        chatMatch={chatMatch}
        currentchatId={currentchatId}
        chatTitles={chatTitles}
        removeSubmit={(chatId) => removeChat(chatId)}
      />
    </Aside>
  );
}

export default Sidebar;

interface AsideProps {
  $openSidebar: boolean;
}
const Aside = styled.aside<AsideProps>`
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: ${(props) => (props.$openSidebar ? "0 0.6rem" : 0)};
  width: ${(props) => (props.$openSidebar ? "240px" : "0px")};
  height: 100%;
  position: relative;
  background-color: white;
  box-shadow: 0 2px 16px 0 #00000008;
  transform: ${(props) =>
    props.$openSidebar ? "translateX(0)" : "translateX(-104%)"};
  overflow-y: auto;
  overflow-x: hidden;
  // transition: transform .7s ease-in-out;

  scrollbar-color: rgb(234, 236, 238) #fff;
  scrollbar-width: auto; // thin
`;
const AsideHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 10;

  & > .logo {
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    height: 2rem;

    & > a > img {
      height: 100%;
    }
  }

  & > .menu {
    padding: 1rem 0 2rem;
    cursor: pointer;
    font-size: 1rem;

    & > div {
      padding: 8px 10px;
      border-radius: 0.6rem;

      & > a {
        display: flex;
        gap: 8px;
        text-decoration: none;
        width: 100%;
      }

      &:hover {
        background-color: ${mainBackColor};
      }
    }
  }
`;
