import React, { useEffect, useRef } from "react";
import Router from "router";
import styled from "styled-components";
import { ErrorModal } from "./ui/ErrorModal";

function Content() {
  return (
    <Container id="content">
      <Router />
    </Container>
  );
}

export default Content;

const Container = styled.div`
  margin-left: 0;
  padding: 1rem 0;
  position: relative;
  width: 100%;
  height: 100%;
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
`;
