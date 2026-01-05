import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Card, CardContent } from './components/Card';
import { Button } from './components/Button';
import { DifficultyBadge } from './components/Badge';
import { LoadingSpinner, PageLoader } from './components/LoadingSpinner';
import { getNextQuestion, submitAnswer } from './api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, 
    XCircle, 
    ArrowRight, 
    Clock, 
    Zap,
    Brain,
    TrendingUp
} from 'lucide-react';

export default function Quiz() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const fetchQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setSelectedOption(null);
        setTimer(0);
        try {
            const res = await getNextQuestion(1);
            setQuestion(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    useEffect(() => {
        if (!loading && !feedback && question) {
            const interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [loading, feedback, question]);

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
            setScore(prev => ({
                correct: prev.correct + (res.data.correct ? 1 : 0),
                total: prev.total + 1
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !question) {
        return <PageLoader message="AI is generating your next challenge..." />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6">
                {/* Header with Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="glass-card p-6 rounded-2xl border mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    <span className="gradient-text">Adaptive Quiz Mode</span>
                                </h1>
                                <p className="text-muted-foreground">
                                    Questions adapt to your skill level in real-time
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-success">
                                        {score.correct}/{score.total}
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Correct
                                    </div>
                                </div>
                                {!feedback && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="font-mono text-lg">{timer}s</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {question && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-3 flex-wrap"
                        >
                            <DifficultyBadge difficulty={question.difficulty} />
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-card border text-sm">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">AI Adaptive</span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <AnimatePresence mode="wait">
                    {question ? (
                        <motion.div
                            key={question.id}
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -30, opacity: 0 }}
                            transition={{ duration: 0.4, type: "spring" }}
                        >
                            <Card className="glass-card border-primary/30 shadow-glow">
                                <CardContent className="p-8 space-y-8">
                                    {/* Topic Badge */}
                                    <div className="flex items-center gap-2">
                                        <Brain className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                                            {question.topic}
                                        </span>
                                    </div>

                                    {/* Question */}
                                    <h2 className="text-3xl font-bold text-foreground leading-relaxed">
                                        {question.content}
                                    </h2>

                                    {/* Options */}
                                    <div className="grid gap-4 pt-4">
                                        {question.options.map((opt, i) => {
                                            let btnClass = "justify-start h-auto py-5 px-6 text-left text-lg font-medium transition-all duration-200 ";
                                            let icon = null;

                                            if (feedback) {
                                                if (opt === feedback.correct_answer) {
                                                    btnClass += "bg-success/20 hover:bg-success/30 border-success text-success shadow-glow ";
                                                    icon = <CheckCircle className="h-5 w-5" />;
                                                } else if (opt === selectedOption && !feedback.correct) {
                                                    btnClass += "bg-error/20 border-error text-error ";
                                                    icon = <XCircle className="h-5 w-5" />;
                                                } else {
                                                    btnClass += "opacity-50 ";
                                                }
                                            } else {
                                                if (selectedOption === opt) {
                                                    btnClass += "border-primary bg-primary/20 ring-2 ring-primary shadow-glow ";
                                                } else {
                                                    btnClass += "hover:bg-white/5 hover:border-primary/50 ";
                                                }
                                            }

                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    whileHover={!feedback ? { scale: 1.02, x: 5 } : {}}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className={btnClass}
                                                        onClick={() => handleOptionSelect(opt)}
                                                        disabled={!!feedback}
                                                    >
                                                        <span className="flex items-center gap-4 flex-1">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 font-mono text-sm">
                                                                {String.fromCharCode(65 + i)}
                                                            </span>
                                                            <span className="flex-1">{opt}</span>
                                                            {icon}
                                                        </span>
                                                    </Button>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feedback Section */}
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-6 p-6 rounded-2xl glass-card border-2 ${
                                        feedback.correct ? 'border-success/50 bg-success/5' : 'border-error/50 bg-error/5'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                {feedback.correct ? (
                                                    <CheckCircle className="h-8 w-8 text-success" />
                                                ) : (
                                                    <XCircle className="h-8 w-8 text-error" />
                                                )}
                                                <h3 className={`text-2xl font-bold ${
                                                    feedback.correct ? "text-success" : "text-error"
                                                }`}>
                                                    {feedback.correct ? "Excellent Work!" : "Not Quite Right"}
                                                </h3>
                                            </div>
                                            <p className="text-foreground/80 mb-4 text-lg">
                                                {feedback.feedback}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <TrendingUp className="h-4 w-4 text-primary" />
                                                <span className="text-muted-foreground">
                                                    Updated {question.topic} strength: 
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {(feedback.new_topic_strength * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={fetchQuestion} 
                                            size="lg"
                                            className="bg-gradient-to-r from-primary to-accent hover:shadow-glow"
                                        >
                                            Next Challenge
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            {!feedback && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 flex justify-end"
                                >
                                    <Button 
                                        onClick={handleSubmit} 
                                        size="lg"
                                        disabled={!selectedOption || loading}
                                        className={`bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all ${
                                            selectedOption ? 'glow' : ''
                                        }`}
                                    >
                                        {loading ? (
                                            <LoadingSpinner size="sm" message="" />
                                        ) : (
                                            <>
                                                Submit Answer
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </div>
    );
}
