import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Quiz from './Quiz';
import KnowledgeGraph from './KnowledgeGraph';
import Chat from './Chat';
import ZenMode from './ZenMode';
import { GamificationProvider } from './contexts/GamificationContext';

function App() {
    return (
        <GamificationProvider>
            <Router>
                <div className="min-h-screen bg-background text-foreground font-sans antialiased">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/graph" element={<KnowledgeGraph />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/zen" element={<ZenMode />} />
                    </Routes>
                </div>
            </Router>
        </GamificationProvider>
    );
}

export default App;
