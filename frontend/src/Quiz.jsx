import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from './components/Card';
import { Button } from './components/Button';
import { DifficultyBadge } from './components/Badge';
import { LoadingSpinner, PageLoader } from './components/LoadingSpinner';
import { getNextQuestionForAttempt, submitAnswer, resetQuiz } from './api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    ArrowRight,
    Clock,
    Zap,
    Brain,
    TrendingUp,
    RefreshCw,
    AlertTriangle,
    Target
} from 'lucide-react';
import { useGamification } from './contexts/GamificationContext';

export default function Quiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const { addXp } = useGamification();
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const [noQuestions, setNoQuestions] = useState(false);
    const [error, setError] = useState(null);

    // Logic for fetching question
    const fetchQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setSelectedOption(null);
        setError(null);
        try {
            const res = await getNextQuestionForAttempt(quizId);
            if (res.data) {
                setQuestion(res.data);
            } else {
                throw new Error("Empty data received");
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setNoQuestions(true);
            } else {
                setError("Something went wrong while fetching the question. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Are you sure you want to reset your progress? This cannot be undone.")) return;
        setLoading(true);
        try {
            await resetQuiz(1);
            setNoQuestions(false);
            setScore({ correct: 0, total: 0 });
            await fetchQuestion();
        } catch (err) {
            console.error(err);
            setError("Failed to reset quiz. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (!loading && !feedback && question && !noQuestions) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    const newTime = prev + 1;
                    if (newTime >= 3600) { // 60 Minutes Limit
                        clearInterval(interval);
                        setNoQuestions(true);
                        alert("Time is Up! Quiz Submitted.");
                    }
                    return newTime;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [loading, feedback, question, noQuestions]);

    const handleOptionSelect = (opt) => {
        if (feedback) return;
        setSelectedOption(opt);
    };

    const handleSubmit = async () => {
        if (!selectedOption) return;

        setLoading(true);
        try {
            const res = await submitAnswer(1, {
                question_id: question.id,
                selected_answer: selectedOption,
                time_taken: timer
            });
            setFeedback(res.data);
            if (res.data.correct) {
                addXp(50);
            }
            setScore(prev => ({
                correct: prev.correct + (res.data.correct ? 1 : 0),
                total: prev.total + 1
            }));
        } catch (err) {
            console.error(err);
            setError("Failed to submit answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !question && !noQuestions && !error) {
        return <PageLoader message="AI is generating your next challenge..." />;
    }

    const timeRemaining = 3600 - timer;
    const isTimeLow = timeRemaining < 300; // 5 mins

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500">
            {/* Distraction-Free Focused Header */}
            <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-mono font-bold text-sm tracking-wide">
                            {score.correct} / {score.total} <span className="text-muted-foreground ml-1">Score</span>
                        </span>
                    </div>
                </div>

                <div className={`px-4 py-2 rounded-full border flex items-center gap-3 font-mono font-bold text-lg transition-all shadow-lg ${isTimeLow
                    ? 'border-error/50 text-error bg-error/10 animate-pulse shadow-glow-error'
                    : 'border-white/10 text-primary bg-background/50'
                    }`}>
                    <Clock className={`h-4 w-4 ${isTimeLow ? 'animate-bounce' : ''}`} />
                    <span>
                        {Math.floor(timeRemaining / 60)}:
                        {String(timeRemaining % 60).padStart(2, '0')}
                    </span>
                </div>

                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-error hover:bg-error/10">
                    Exit Mode
                </Button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-8 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center border border-error/20 max-w-md mx-auto"
                        >
                            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-error animate-pulse" />
                            <h2 className="text-2xl font-bold mb-2 text-error">System Alert</h2>
                            <p className="text-muted-foreground mb-6">{error}</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={fetchQuestion} variant="outline">Retry</Button>
                                <Button onClick={handleReset} variant="destructive">Reset</Button>
                            </div>
                        </motion.div>
                    ) : noQuestions ? (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 rounded-3xl border border-primary/20 text-center max-w-2xl mx-auto relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 blur-3xl" />
                            <div className="relative z-10">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-glow">
                                    <Brain className="h-12 w-12 text-primary animate-pulse-slow" />
                                </div>
                                <h2 className="text-4xl font-bold mb-4 font-brand tracking-tight">Session Complete</h2>
                                <p className="text-xl text-muted-foreground mb-8">
                                    Neural calibration finished. Your adaptive profile has been updated.
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-8 max-w-sm mx-auto">
                                    <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                                        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Score</div>
                                        <div className="text-3xl font-bold text-success">{score.correct}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                                        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Accuracy</div>
                                        <div className="text-3xl font-bold text-primary">
                                            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <Button onClick={() => navigate('/dashboard')} size="lg" className="px-8">
                                        Return to Base
                                    </Button>
                                    <Button onClick={handleReset} variant="outline" size="lg">
                                        Restart
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : question ? (
                        <motion.div
                            key={question.id}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-3xl mx-auto"
                        >
                            {/* Question Card */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <DifficultyBadge difficulty={question.difficulty} />
                                    <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                                    <span className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                                        <Brain className="h-3 w-3" />
                                        {question.subject_name ? `${question.subject_name} / ` : ''}{question.topic}
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight md:leading-snug mb-2 font-display">
                                    {question.content}
                                </h2>
                            </div>

                            {/* Options Grid */}
                            <div className="grid gap-4">
                                {question.options && question.options.map((opt, i) => {
                                    const isCorrect = feedback && opt === feedback.correct_answer;
                                    const isWrong = feedback && opt === selectedOption && !feedback.correct;
                                    const isSelected = selectedOption === opt;
                                    const isDisabled = !!feedback;

                                    return (
                                        <motion.button
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            disabled={isDisabled}
                                            onClick={() => handleOptionSelect(opt)}
                                            whileHover={!isDisabled ? { scale: 1.01, translateX: 4 } : {}}
                                            whileTap={!isDisabled ? { scale: 0.99 } : {}}
                                            className={`relative group w-full p-6 text-left rounded-xl border-2 transition-all duration-300 ${isCorrect
                                                ? 'bg-success/20 border-success shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                                                : isWrong
                                                    ? 'bg-error/10 border-error shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                                                    : isSelected
                                                        ? 'bg-primary/15 border-primary shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                                        : 'bg-card border-white/5 hover:border-primary/30 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-lg transition-colors duration-300 ${isCorrect
                                                    ? 'border-success bg-success text-black'
                                                    : isWrong
                                                        ? 'border-error bg-error text-white'
                                                        : isSelected
                                                            ? 'border-primary bg-primary text-black'
                                                            : 'border-white/10 group-hover:border-primary/50 text-muted-foreground'
                                                    }`}>
                                                    {isCorrect ? <CheckCircle className="h-6 w-6" /> :
                                                        isWrong ? <XCircle className="h-6 w-6" /> :
                                                            String.fromCharCode(65 + i)}
                                                </div>
                                                <div className={`text-lg font-medium transition-colors ${isSelected || isCorrect ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                    {opt}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Action Bar */}
                            <div className="mt-8 flex items-center justify-between">
                                {!feedback ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="ml-auto"
                                    >
                                        <Button
                                            onClick={handleSubmit}
                                            size="lg"
                                            disabled={!selectedOption || loading}
                                            className="px-8 h-14 text-lg shadow-glow hover:shadow-glow-lg transition-all"
                                        >
                                            {loading ? 'Processing...' : 'Confirm Selection'}
                                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`w-full p-6 rounded-2xl border ${feedback.correct ? 'bg-success/5 border-success/30' : 'bg-error/5 border-error/30'}`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className={`text-xl font-bold mb-2 ${feedback.correct ? 'text-success' : 'text-error'}`}>
                                                    {feedback.correct ? 'Correct Answer' : 'Incorrect'}
                                                </h3>
                                                <p className="text-foreground/90 leading-relaxed mb-4">
                                                    {feedback.feedback}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg w-fit">
                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                    Updated Mastery: <span className="font-bold text-primary">{(feedback.new_topic_strength * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                            <Button onClick={fetchQuestion} size="lg" className="shrink-0 h-14 px-8">
                                                Next Question
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>
        </div>
    );
}