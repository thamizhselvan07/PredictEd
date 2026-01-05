import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getQuizTypes, startQuizSession } from './api';
import { motion } from 'framer-motion';
import { Play, ClipboardList, Clock, Zap, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './components/Button';

export default function QuizList() {
    const { subjectId } = useParams();
    const [quizTypes, setQuizTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getQuizTypes().then(res => {
            setQuizTypes(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleStartQuiz = (type) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 1; // Fallback to 1 for demo if auth not perfect

        startQuizSession(subjectId, type, userId).then(res => {
            // Received attempt_id
            navigate(`/quiz/${res.data.attempt_id}`);
        }).catch(err => {
            console.error("Failed to start session", err);
            alert("Could not start quiz session. Please try again.");
        });
    };

    if (loading) return <PageLoader message="Loading Quiz Options..." />;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-5xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground mb-4">
                        ← Back to Subjects
                    </button>
                    <h1 className="text-3xl font-bold mb-2">
                        Select <span className="gradient-text">Quiz Mode</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Choose how you want to challenge yourself.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {quizTypes.map((quiz, i) => (
                        <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-1">{quiz.name}</h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    {quiz.id === 'basics' && "Solidify your fundamentals."}
                                    {quiz.id === 'concept' && "Deep dive into core concepts."}
                                    {quiz.id === 'mixed' && "Adaptive difficulty testing."}
                                    {quiz.id === 'full' && "Simulate a real exam section."}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                                    <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" /> 50 Questions</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Timed</span>
                                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Adaptive</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleStartQuiz(quiz.id)}
                                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:shadow-glow"
                            >
                                <Play className="mr-2 h-4 w-4" /> Start {quiz.name}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
