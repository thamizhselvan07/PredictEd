import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNextQuestion, submitAnswer } from './api';
import { useGamification } from './contexts/GamificationContext';
import { Loader2, Check, X, ArrowRight, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { Button } from './components/Button';

export default function ZenMode() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false); // Placeholder logic
    const { addXp } = useGamification();

    const fetchQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setSelectedOption(null);
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

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

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
                time_taken: 30 // Simplified tracking
            });
            setFeedback(res.data);
            if (res.data.correct) addXp(50);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        fetchQuestion();
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 flex flex-col transition-colors duration-1000">
            {/* Minimalist Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 opacity-30 hover:opacity-100 transition-opacity">
                <div className="text-sm tracking-[0.3em] font-light uppercase">Zen Mode</div>
                <div className="flex gap-4">
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="hover:text-white transition-colors">
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button onClick={toggleFullscreen} className="hover:text-white transition-colors">
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <a href="/dashboard" className="hover:text-white transition-colors text-sm uppercase tracking-wide">
                        Exit
                    </a>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center p-6 max-w-3xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {loading && !question ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-1 h-16 bg-white/20 overflow-hidden rounded-full">
                                <div className="w-full h-full bg-white animate-pulse" />
                            </div>
                        </motion.div>
                    ) : question ? (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full space-y-12"
                        >
                            <div className="space-y-6 text-center">
                                <div className="text-xs font-mono text-white/20 uppercase tracking-widest">
                                    {question.topic}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-light leading-tight text-white/90">
                                    {question.content}
                                </h1>
                            </div>

                            <div className="grid gap-4 max-w-xl mx-auto">
                                {question.options.map((opt, i) => {
                                    const isSelected = selectedOption === opt;
                                    const showResult = feedback && (opt === feedback.correct_answer || (opt === selectedOption && !feedback.correct));
                                    const isCorrect = feedback && opt === feedback.correct_answer;

                                    return (
                                        <motion.button
                                            key={i}
                                            whileHover={!feedback ? { scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                                            whileTap={!feedback ? { scale: 0.98 } : {}}
                                            onClick={() => handleOptionSelect(opt)}
                                            disabled={!!feedback}
                                            className={`
                                                relative w-full text-left p-6 rounded-lg text-lg font-light transition-all duration-500
                                                border border-white/5 bg-transparent
                                                ${isSelected && !feedback ? 'border-white/40 bg-white/5' : ''}
                                                ${showResult && isCorrect ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200' : ''}
                                                ${showResult && !isCorrect ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' : ''}
                                                ${feedback && !showResult ? 'opacity-20' : ''}
                                            `}
                                        >
                                            <span className="flex items-center justify-between">
                                                <span>{opt}</span>
                                                {showResult && (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                    >
                                                        {isCorrect ? <Check size={20} /> : <X size={20} />}
                                                    </motion.span>
                                                )}
                                            </span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="h-12 flex justify-center">
                                {selectedOption && !feedback && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleSubmit}
                                        className="text-white/60 hover:text-white uppercase tracking-[0.2em] text-sm flex items-center gap-2 transition-colors"
                                    >
                                        Inhale & Submit
                                    </motion.button>
                                )}
                                {feedback && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={handleNext}
                                        className="text-white/60 hover:text-white uppercase tracking-[0.2em] text-sm flex items-center gap-2 transition-colors"
                                    >
                                        Continue Flow <ArrowRight size={16} />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
            </div>
        </div>
    );
}
