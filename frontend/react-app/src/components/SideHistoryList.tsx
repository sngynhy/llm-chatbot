import React, { memo, useState } from "react";
import { MathExpr } from "./content/MathExpr";
import { CgMathPlus } from "react-icons/cg";
import styled from "styled-components";
import { IconButton } from "./ui/IconButton";
import { Link, useMatch } from "react-router-dom";
import { hoverBackColor, selectedBackColor } from "styles/Common";

interface SideHistoryListProps {
  currentchatId: string | null;
  chatTitles: { chatId: string; title: string; isLatex?: boolean }[];
  removeSubmit: (chatId: string) => void;
}

export const SideHistoryList = memo(
  ({ currentchatId, chatTitles, removeSubmit }: SideHistoryListProps) => {
    const [hoveredId, setHoveredId] = useState(null);
    const chatMatch = useMatch("/chat/:chatId");

    return (
      <div>
        <p
          style={{
            margin: "0.6rem 0.5rem",
            fontSize: "14px",
            color: "rgb(158, 158, 158)",
          }}
        >
          질문 내역
        </p>
        <ul style={styles.ul}>
          {chatTitles.map((item) => {
            const isHovered = hoveredId === item.chatId;
            const isSelected =
              Boolean(chatMatch) && currentchatId === item.chatId;

            return (
              <List
                key={item.chatId}
                $selected={isSelected}
                $isHovered={isHovered}
                onMouseEnter={() => setHoveredId(item.chatId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link to={`/chat/${item.chatId}`} state={{ initialAsk: false }}>
                  {!item.isLatex ? (
                    <div className="title">{item.title}</div>
                  ) : (
                    <MathExpr latex={item.title} />
                  )}
                </Link>

                {isHovered && (
                  <IconButton
                    size="20px"
                    color="gray"
                    onClick={() => removeSubmit(item.chatId)}
                  >
                    <CgMathPlus style={{ transform: "rotate(45deg)" }} />
                  </IconButton>
                )}
              </List>
            );
          })}
        </ul>
      </div>
    );
  }
);

const styles = {
  ul: {
    listStyle: "none",
    cursor: "pointer",
    padding: 0,
    margin: 0,
    fontSize: "15px",
  },
  // li: {
  //   padding: "8px 0",
  //   fontSize: "16px",
  //   height: "auto",
  //   display: "flex",
  //   justifyContent: "space-between",
  //   width: "calc(100% - 20px)",
  //   whiteSpace: "nowrap",
  // },
};

interface ListProps {
  $selected: boolean;
  $isHovered: boolean;
}
const List = styled.li<ListProps>`
  padding: 0.5rem;
  border-radius: 0.6rem;
  display: flex;
  gap: 8px;
  color: rgb(59, 59, 59);
  background-color: ${(props) =>
    props.$selected ? selectedBackColor : "transparent"};

  &:hover {
    background-color: ${hoverBackColor};
  }

  & > a {
    color: rgb(59, 59, 59);
    text-decoration: none;
    width: 100%;
  }
`;
