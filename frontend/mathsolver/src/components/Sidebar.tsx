import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BsLayoutSidebar } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { IconButton } from "components/ui/IconButton";
import { useLocalStore } from "stores/useLocalStore";
import { useHistoryStore } from "stores/useHistoryStore";
import { useChatHistory } from "hooks/useChatHistory";
import { SideHistoryList } from "./SideHistoryList";
import { hoverBackColor, selectedBackColor } from "styles/Common";
import Logo from "./ui/Logo";

function Sidebar() {
  const { openSidebar, setOpenSidebar } = useLocalStore();
  const { currentchatId, chatTitles } = useHistoryStore();
  const { actions } = useChatHistory();

  useEffect(() => {
    actions.getChatTitles();
  }, []);

  const navigate = useNavigate();
  const removeChat = async (chatId: string) => {
    await actions.removeChat(chatId);
    if (currentchatId === chatId) navigate("/");
  };

  return (
    <Aside $openSidebar={openSidebar}>
      <AsideHeader $openSidebar={openSidebar}>
        <div className="aside-header">
          <Link to="/">
            <Logo size="2rem" color="black" />
          </Link>
          <IconButton
            size="18px"
            color="gray"
            style={{ alignItems: "baseline" }}
            hoverStyle={{ color: "black" }}
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <BsLayoutSidebar />
          </IconButton>
        </div>
        <div className="menu">
          <Link to="/" style={{ color: styles.textColor }}>
            <IconButton size="24px" color={styles.textColor}>
              <CiEdit />
            </IconButton>
            <span>새 질문</span>
          </Link>
          <Link to="/search" style={{ color: styles.textColor }}>
            <IconButton size="24px" color={styles.textColor}>
              <CiSearch />
            </IconButton>
            <span>채팅 검색</span>
          </Link>
        </div>
      </AsideHeader>

      {openSidebar && (
        <SideHistoryList
          currentchatId={currentchatId}
          chatTitles={chatTitles}
          removeSubmit={(chatId) => removeChat(chatId)}
        />
      )}
    </Aside>
  );
}

export default Sidebar;

const styles = {
  textColor: "rgb(59, 59, 59)",
};

interface AsideProps {
  $openSidebar: boolean;
}
const Aside = styled.aside<AsideProps>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 1.5rem;
  padding: 1rem 0.5rem;
  width: ${(props) => (props.$openSidebar ? "15rem" : "40px")};
  height: 100%;
  position: relative;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease, transform 0.3s ease;

  scrollbar-color: rgb(234, 236, 238) #fff;
  scrollbar-width: auto; // thin
`;

interface AsideHeaderProps {
  $openSidebar: boolean;
}

const AsideHeader = styled.div<AsideHeaderProps>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 1.5rem;
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 10;

  & > .aside-header {
    padding: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    height: 2rem;

    & > a > img {
      height: 100%;
    }
  }

  & > .menu {
    cursor: pointer;
    font-size: 1rem;

    & > a {
      padding: 0.5rem;
      border-radius: 0.6rem;

      display: flex;
      gap: 8px;
      text-decoration: none;

      & > span {
        display: ${(props) => (props.$openSidebar ? "block" : "none")};
      }

      &:hover {
        background-color: ${hoverBackColor};
      }

      &:active {
        background-color: ${selectedBackColor};
      }
    }
  }
`;
