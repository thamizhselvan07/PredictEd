import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import Quiz from './Quiz';
import KnowledgeGraph from './KnowledgeGraph';
import Chat from './Chat';
import ZenMode from './ZenMode';
import StreamSelection from './StreamSelection';
import ExamSelection from './ExamSelection';
import SubjectSelection from './SubjectSelection';
import QuizList from './QuizList';
import Syllabus from './Syllabus';
import Home from './Home';
import { GamificationProvider } from './contexts/GamificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // In production, verify token validity with backend
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <GamificationProvider>
                <Router>
                    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
                        <Routes>
                            {/* Auth Routes */}
                            <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected Routes */}
                            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/streams" element={<ProtectedRoute><StreamSelection /></ProtectedRoute>} />
                            <Route path="/syllabus" element={<ProtectedRoute><Syllabus /></ProtectedRoute>} />

                            <Route path="/stream/:streamId" element={<ProtectedRoute><ExamSelection /></ProtectedRoute>} />
                            <Route path="/exam/:examId" element={<ProtectedRoute><SubjectSelection /></ProtectedRoute>} />
                            <Route path="/subject/:subjectId" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />

                            <Route path="/quiz/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

                            {/* Extras */}
                            <Route path="/graph" element={<ProtectedRoute><KnowledgeGraph /></ProtectedRoute>} />
                            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                            <Route path="/zen" element={<ProtectedRoute><ZenMode /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </Router>
            </GamificationProvider>
        </ThemeProvider>
    );
}

export default App;
