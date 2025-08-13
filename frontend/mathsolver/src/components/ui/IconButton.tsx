import React from "react";
import styled from "styled-components";

interface IconButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: string;
  color?: string;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  disabled?: boolean;
  onClick?: () => void;
}

export const IconButton = ({
  children,
  type = "button",
  size = "24px",
  color = "black",
  style,
  hoverStyle,
  disabled = false,
  onClick,
}: IconButtonProps) => {
  return (
    <Button
      type={type as "button" | "submit" | "reset"}
      $size={size}
      $color={color}
      style={style}
      $hoverStyle={hoverStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

interface ButtonProps {
  $size: string;
  $color: string;
  $hoverStyle?: React.CSSProperties;
}
const Button = styled.button<ButtonProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;
  padding: 0;

  &:disabled {
    & > svg {
      color: gray;
      cursor: auto;
    }
  }

  &:hover {
    & > svg {
      color: ${(props) => props.$hoverStyle?.color || props.$color};
      background-color: ${(props) =>
        props.$hoverStyle?.backgroundColor || "transparent"};
    }
  }

  & > svg,
  & > img {
    width: ${(props) => props.$size};
    height: ${(props) => props.$size};
    color: ${(props) => props.$color};
  }
`;
