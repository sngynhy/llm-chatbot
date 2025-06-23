import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AskLLM from 'components/content/AskLLM'
import Graph from 'pages/Graph'
import History from 'pages/History'
import NewChat from 'pages/NewChat'

function Router () {
    return (
        <div id="routes" style={{padding: '2rem 4rem'}}>
            <Routes>
                {/* <Route index path="/" element={<AskLLM />} /> */}
                <Route index path="/" element={<NewChat />} />
                <Route path="/graph" element={<Graph />} />
                <Route path="/history/:initial/:id" element={<History />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default Router