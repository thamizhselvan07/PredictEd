import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Dashboard from './Dashboard';
import StreamSelection from './StreamSelection';
import ExamSelection from './ExamSelection';
import SubjectSelection from './SubjectSelection';
import TopicSelection from './TopicSelection';
import QuizList from './QuizList';
import Quiz from './Quiz';
import KnowledgeGraph from './KnowledgeGraph';
import Chat from './Chat';
import Syllabus from './Syllabus';
import ZenMode from './ZenMode';
import QuizGenerator from './components/QuizGenerator';
import Onboarding from './Onboarding';
import LearningPath from './LearningPath';
import MockTests from './MockTests';
import PostMockAnalysis from './PostMockAnalysis';

import { GamificationProvider } from './contexts/GamificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // In production, verify token validity with backend
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <GamificationProvider>
                <Router>
                    <div className="min-h-screen bg-background font-sans text-foreground">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected Routes */}
                            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                            <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
                            <Route path="/mock-tests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
                            <Route path="/mock-analysis" element={<ProtectedRoute><PostMockAnalysis /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/streams" element={<ProtectedRoute><StreamSelection /></ProtectedRoute>} />
                            <Route path="/syllabus" element={<ProtectedRoute><Syllabus /></ProtectedRoute>} />

                            <Route path="/stream/:streamId" element={<ProtectedRoute><ExamSelection /></ProtectedRoute>} />
                            <Route path="/exam/:examId" element={<ProtectedRoute><SubjectSelection /></ProtectedRoute>} />
                            <Route path="/exam/:examId/subject/:subjectId/topics" element={<ProtectedRoute><TopicSelection /></ProtectedRoute>} />
                            <Route path="/subject/:subjectId" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />

                            <Route path="/quiz/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

                            {/* Extras */}
                            <Route path="/graph" element={<ProtectedRoute><KnowledgeGraph /></ProtectedRoute>} />
                            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                            <Route path="/zen" element={<ProtectedRoute><ZenMode /></ProtectedRoute>} />
                            <Route path="/quiz/generate" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </Router>
            </GamificationProvider>
        </ThemeProvider>
    );
}

export default App;
