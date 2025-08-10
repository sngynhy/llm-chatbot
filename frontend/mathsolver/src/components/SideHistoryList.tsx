import React, { memo, useState } from "react";
import { MathExpr } from "./content/MathExpr";
import { CgMathPlus } from "react-icons/cg";
import styled from "styled-components";
import { IconButton } from "./ui/IconButton";
import { Link, PathMatch } from "react-router-dom";
import { GoStack } from "react-icons/go";

interface SideHistoryListProps {
  chatMatch: PathMatch<"chatId"> | null;
  currentchatId: string | null;
  chatTitles: { chatId: string; title: string; isLatex?: boolean }[];
  removeSubmit: (chatId: string) => void;
}

export const SideHistoryList = memo(
  ({
    chatMatch,
    currentchatId,
    chatTitles,
    removeSubmit,
  }: SideHistoryListProps) => {
    // console.log("SideHistoryList", chatMatch);
    const [hoveredId, setHoveredId] = useState(null);

    return (
      <div style={{ padding: "0 0.5rem" }}>
        <div
          style={{
            fontSize: "15px",
            color: "gray",
          }}
        >
          질문 내역
        </div>
        <Ul style={styles.ul} $borderTop={chatTitles.length > 0}>
          {chatTitles.map((item) => {
            const isHovered = hoveredId === item.chatId;
            const isSelected =
              Boolean(chatMatch) && currentchatId === item.chatId;

            return (
              <Li
                key={item.chatId}
                $selected={isSelected}
                $isHovered={isHovered}
                style={styles.li}
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
                    size={20}
                    color="gray"
                    onClick={() => removeSubmit(item.chatId)}
                  >
                    <CgMathPlus style={{ transform: "rotate(45deg)" }} />
                  </IconButton>
                )}
                {/* {isHovered && (
                <DeleteButton
                  $isHovered={isHovered}
                  size={20}
                  color="gray"
                  onClick={() => removeSubmit(item.chatId)}
                >
                  <CgMathPlus style={{ transform: "rotate(45deg)" }} />
                </DeleteButton>
              )} */}
              </Li>
            );
          })}
        </Ul>
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
  },
  li: {
    padding: "8px 0",
    fontSize: "16px",
    height: "auto",
    display: "flex",
    justifyContent: "space-between",
    width: "calc(100% - 20px)",
    whiteSpace: "nowrap",
  },
};

interface UlProps {
  $borderTop: boolean;
}
const Ul = styled.ul<UlProps>``;
// const Ul = styled.ul<UlProps>`
//   ${(props) => props.$borderTop && "border-top: 1px solid rgb(234, 236, 238);"}

//   & > div > a {
//     text-decoration: none;
//     display: flex;
//     gap: 8px;
//   }
// `;

interface LiProps {
  $selected: boolean;
  $isHovered: boolean;
}
const Li = styled.li<LiProps>`
  padding: 12px 0;
  border-radius: 0.6rem;
  display: flex;
  gap: 8px;
  color: ${(props) => (props.$selected ? "black" : "rgb(59, 59, 59)")};
  width: 100%;
  ${(props) => props.$selected && "font-weight: 500;"}

  &:hover {
    background-color: #f3f5f7; // #f7f7f7;
  }

  & > a {
    color: ${(props) => (props.$selected ? "black" : "rgb(59, 59, 59)")};
    text-decoration: none;
    width: 100%;
  }
`;

// const Li = styled.li`
//   padding: 12px 20px;
//   border-radius: 12px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   color: ${(props) => (props.$selected ? "black" : "rgb(59, 59, 59)")};
//   width: 100%;
//   font-size: 14px;
//   white-space: nowrap;

//   // ✅ 부드러운 전환
//   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//   position: relative;

//   // ✅ 왼쪽 보더 효과
//   &::before {
//     content: "";
//     position: absolute;
//     left: 0;
//     top: 0;
//     width: 3px;
//     height: 100%;
//     background-color: transparent;
//     transition: background-color 0.3s ease;
//   }

//   &:hover {
//     background-color: #f8f9fa;
//     transform: translateX(4px);
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

//     &::before {
//       background-color: #007bff;
//     }
//   }

//   // ✅ 선택된 아이템
//   ${(props) =>
//     props.$selected &&
//     `
//     background-color: #e3f2fd;
//     font-weight: 500;

//     &::before {
//       background-color: #2196f3;
//     }

//     &:hover {
//       background-color: #bbdefb;
//     }
//   `}

//   & > a {
//     color: inherit;
//     text-decoration: none;
//     width: 100%;
//     transition: color 0.2s ease-in-out;
//   }

//   &:hover > a {
//     color: #007bff;
//   }
// `;
// const DeleteButton = styled(IconButton)`
//   animation: fadeIn 0.2s ease-in-out;

//   &:hover {
//     & > svg {
//       color: #dc3545 !important;
//     }
//     transform: scale(1.1);
//   }

//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//       transform: scale(0.8);
//     }
//     to {
//       opacity: 1;
//       transform: scale(1);
//     }
//   }
// `;
