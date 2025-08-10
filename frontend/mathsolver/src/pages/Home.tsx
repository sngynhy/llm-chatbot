import React from "react";
import styled from "styled-components";
import Sidebar from "components/Sidebar";
import Content from "components/Content";
import { useStyleStore } from "stores/useStyleStore";

function Home() {
  const { openSidebar } = useStyleStore();

  return (
    <Container $openSidebar={openSidebar}>
      <Sidebar />
      <Content />
    </Container>
  );
}
interface ContainerProps {
  $openSidebar: boolean;
}
const Container = styled.div<ContainerProps>`
  display: flex;
  gap: ${(props) => (props.$openSidebar ? "1rem" : 0)};
  height: calc(100vh - 2rem);
  height: calc(100dvh - 2rem);
  overflow: hidden;
  padding: 1rem;
`;
export default Home;
