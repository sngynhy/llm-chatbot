import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Graph from "pages/Graph";
import ChatPage from "pages/ChatPage";

function Router() {
  return (
    <div id="routes" style={styles.routes}>
      <Routes>
        <Route index path="/" element={<ChatPage isNewChat={true} />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/chat/:chatId" element={<ChatPage isNewChat={false} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

const styles = {
  routes: {
    // padding: '2rem 4rem',
    // height: 'calc(100% - 4rem)',
    height: "100%",
    overflow: "auto",
    scrollbarColor: "rgb(234, 236, 238)",
    scrollbarWidth: "thin",
  },
} as const;
export default Router;
