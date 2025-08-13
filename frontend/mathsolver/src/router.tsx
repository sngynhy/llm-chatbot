import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Search from "pages/Search";
import ChatPage from "pages/ChatPage";

function Router() {
  return (
    <div id="routes" style={styles.routes}>
      <Routes>
        <Route index path="/" element={<ChatPage isNewChat={true} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat/:chatId" element={<ChatPage isNewChat={false} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

const styles = {
  routes: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    overflow: "scroll",
    scrollbarColor: "rgb(234, 236, 238)",
    scrollbarWidth: "thin",
  },
} as const;
export default Router;
