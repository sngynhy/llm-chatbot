import React from "react";
import styled from "styled-components";
import Sidebar from "components/Sidebar";
import Content from "components/Content";
import { useLocalStore } from "stores/useLocalStore";

function Home() {
  const { openSidebar } = useLocalStore();

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
  height: 100dh;
  height: 100dvh;
  overflow: hidden;

  // display: grid;
  // gap: 0.1rem;
  // transition: width 0.3s ease, transform 0.3s ease;
  // grid-template-rows: 1fr;
  // grid-template-areas: "sidebar content";
  // padding: 0.8rem;
`;
// grid-template-columns: ${(props) =>
//   props.$openSidebar ? "17rem 1fr" : "3rem 1fr"};
export default Home;
