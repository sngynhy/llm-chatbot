import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Graph from 'pages/Graph'
import ChatPage from 'pages/ChatPage'

function Router ({ scrollRef }) {
    // console.log('Router', scrollRef);
    return (
        <div id="routes" style={{padding: '2rem 4rem', height: 'calc(100% - 4rem)'}}>
            <Routes>
                <Route index path="/" element={<ChatPage isNewChat={true} />} />
                <Route path="/graph" element={<Graph />} />
                <Route path="/history/:initialAsk/:sessionId" element={<ChatPage isNewChat={false} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default Router