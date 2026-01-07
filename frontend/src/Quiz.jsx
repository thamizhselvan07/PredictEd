import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './components/Button';
import { PageLoader } from './components/LoadingSpinner';
import InstructionPage from './components/InstructionPage';
import { getNextQuestionForAttempt, submitAnswer, resetQuiz } from './api';
import { useGamification } from './contexts/GamificationContext';
import {
    Clock,
    User,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Monitor,
    Save,
    RotateCcw,
    CheckCircle2,
    HelpCircle,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MARKING SCHEMES ---
const MARKING_SCHEMES = {
    'JEE': { correct: 4, wrong: -1, type: 'JEE' },
    'NEET': { correct: 4, wrong: -1, type: 'NEET' },
    'CLAT': { correct: 1, wrong: -0.25, type: 'CLAT' },
    'DEFAULT': { correct: 1, wrong: 0, type: 'General' }
};

const getMarkingScheme = (examName) => {
    if (!examName) return MARKING_SCHEMES['DEFAULT'];
    const name = examName.toUpperCase();
    if (name.includes('JEE')) return MARKING_SCHEMES['JEE'];
    if (name.includes('NEET')) return MARKING_SCHEMES['NEET'];
    if (name.includes('CLAT') || name.includes('LAW')) return MARKING_SCHEMES['CLAT'];
    return MARKING_SCHEMES['DEFAULT'];
};

// --- STATUS CONSTANTS ---
const STATUS = {
    NOT_VISITED: 'not_visited',
    NOT_ANSWERED: 'not_answered',
    ANSWERED: 'answered',
    MARKED_REVIEW: 'marked_review',
    ANSWERED_MARKED_REVIEW: 'answered_marked_review'
};

export default function Quiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { addXp } = useGamification();

    // --- STATE ---
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState(180 * 60); // 3 Hours Countdown
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Persist sidebar state
    const [hasStarted, setHasStarted] = useState(false); // Controls Instruction Page

    // Exam Data Cache
    const [questions, setQuestions] = useState([]); // Array of fetched question objects
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { qId: option }
    const [questionStatus, setQuestionStatus] = useState({}); // { qId: STATUS }

    // Derived
    const currentQ = questions[currentQuestionIndex];
    const markingScheme = currentQ ? getMarkingScheme(currentQ.exam_name || 'DEFAULT') : MARKING_SCHEMES['DEFAULT'];

    // --- INITIALIZATION ---
    useEffect(() => {
        // Initial fetch
        fetchNextQuestion();
    }, []);

    // Timer (Countdown 180 mins) - Only starts after instructions
    useEffect(() => {
        if (!hasStarted) return;

        const interval = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    clearInterval(interval);
                    // Auto-submit logic here or alert
                    alert("Time Up! Submitting...");
                    navigate('/dashboard');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [hasStarted]);

    // --- DATA FETCHING ---
    const fetchNextQuestion = async () => {
        setLoading(true);
        try {
            // Check if we already have it in cache (unlikely for "next" unless purely pre-fetching, but logic stands)
            // Ideally backend is adaptive, so we fetch one by one.
            const res = await getNextQuestionForAttempt(quizId);

            if (res.data) {
                const newQ = res.data;
                // Avoid duplicates if API sends same Q
                setQuestions(prev => {
                    if (prev.find(q => q.id === newQ.id)) return prev;
                    return [...prev, newQ];
                });

                // Set status to Not Answered if visiting for first time
                setQuestionStatus(prev => ({
                    ...prev,
                    [newQ.id]: prev[newQ.id] || STATUS.NOT_ANSWERED
                }));

                // If this is the first load, set index 0
                if (questions.length === 0) {
                    setCurrentQuestionIndex(0);
                } else {
                    // Navigate to it
                    setCurrentQuestionIndex(prev => prev + 1);
                }
            } else {
                // No more questions or error
                alert("End of Exam Stream"); // Or handle gracefully
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                // Exam Over
                alert("Exam Completed!");
                navigate('/dashboard');
            } else {
                setError("Network Error");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- ACTIONS ---

    const handleOptionSelect = (opt) => {
        setUserAnswers(prev => ({
            ...prev,
            [currentQ.id]: opt
        }));
    };

    const saveAndNext = async () => {
        const ans = userAnswers[currentQ.id];

        // Update Status
        let newStatus = STATUS.NOT_ANSWERED;
        if (ans) {
            newStatus = STATUS.ANSWERED;
            // Submit to Backend
            try {
                // Fire and forget submission to keep UI snappy, or await if strict validity needed
                await submitAnswer(1, {
                    question_id: currentQ.id,
                    selected_answer: ans,
                    time_taken: (180 * 60) - timer // time taken = max - current
                });
            } catch (e) {
                console.error("Save failed", e);
            }
        } else {
            // If skipped
        }

        updateStatus(currentQ.id, newStatus);
        moveToNext();
    };

    const markForReview = async () => {
        const ans = userAnswers[currentQ.id];
        let newStatus = STATUS.MARKED_REVIEW;

        if (ans) {
            newStatus = STATUS.ANSWERED_MARKED_REVIEW;
            // Submit even if marked for review (Official JEE Rule)
            try {
                await submitAnswer(1, {
                    question_id: currentQ.id,
                    selected_answer: ans,
                    time_taken: (180 * 60) - timer
                });
            } catch (e) { console.error(e); }
        }

        updateStatus(currentQ.id, newStatus);
        moveToNext();
    };

    const clearResponse = () => {
        setUserAnswers(prev => {
            const next = { ...prev };
            delete next[currentQ.id];
            return next;
        });
        updateStatus(currentQ.id, STATUS.NOT_ANSWERED);
    };

    const updateStatus = (qId, status) => {
        setQuestionStatus(prev => ({ ...prev, [qId]: status }));
    };

    const moveToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Fetch new question
            fetchNextQuestion();
        }
    };

    const handlePaletteClick = (index) => {
        // Enforce adaptive constraint: Can only go back to visited, or current.
        // Cannot jump to future indices that don't exist.
        if (index > questions.length - 1) return;
        setCurrentQuestionIndex(index);
    };

    // --- TIMING ---
    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const remS = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;
    };

    // --- RENDER HELPERS ---
    const getStatusColor = (status) => {
        switch (status) {
            case STATUS.ANSWERED: return 'bg-green-500 text-white border-green-600';
            case STATUS.NOT_ANSWERED: return 'bg-red-500 text-white border-red-600';
            case STATUS.MARKED_REVIEW: return 'bg-purple-600 text-white border-purple-800';
            case STATUS.ANSWERED_MARKED_REVIEW: return 'bg-purple-600 text-white border-purple-800 relative overflow-hidden'; // Need checkmark
            case STATUS.NOT_VISITED:
            default: return 'bg-white/10 text-muted-foreground border-white/20';
        }
    };

    if (loading && questions.length === 0) return <PageLoader message="Setting up Exam Environment..." />;

    // --- CHECK: SHOW INSTRUCTIONS FIRST ---
    if (!hasStarted && questions.length > 0) {
        // Use the exam name from the first question/context if available
        // Or default to JEE if not found
        const examName = currentQ?.exam_name || 'General';
        return <InstructionPage examName={examName} onProceed={() => setHasStarted(true)} />;
    }

    // --- ACTUAL QUIZ UI ---
    return (
        <div className="h-screen w-screen bg-[#1e1e1e] text-gray-100 flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* --- HEADER --- */}
            <header className="h-16 bg-[#2d2d2d] border-b border-white/10 flex items-center justify-between px-4 shrink-0 shadow-md z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
                        <Monitor className="text-cyan-400 w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wide text-white">JEE/NEET MOCK 2024</h1>
                        <p className="text-xs text-muted-foreground">Adaptive Mode Enabled</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-black/40 px-4 py-2 rounded border border-white/10 flex items-center gap-3">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Time Left</span>
                        <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timer < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            <Clock className="w-4 h-4 text-cyan-400" />
                            {formatTime(timer)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white shadow-lg">
                            YU
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-white">Yuvaranjan S</p>
                            <p className="text-xs text-cyan-400">Candidate ID: 29012025</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN BODY --- */}
            <div className="flex-1 flex overflow-hidden">
                {/* QUESTION AREA */}
                <main className="flex-1 flex flex-col relative w-full h-full overflow-y-auto bg-[#1e1e1e]">

                    {/* INFO BAR */}
                    <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-cyan-400">Question {currentQuestionIndex + 1}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider mx-2">|</span>
                            <span className="text-xs text-gray-400">Single Correct Option</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                            <button className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded transition-colors uppercase font-bold tracking-wider">
                                <HelpCircle className="w-3.5 h-3.5" /> QP
                            </button>
                            <span className="text-green-400 font-bold">+{markingScheme.correct}</span>
                            <span className="text-red-400 font-bold">{markingScheme.wrong}</span>
                        </div>
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
                        {currentQ ? (
                            <motion.div
                                key={currentQ.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="text-xl md:text-2xl font-medium leading-relaxed text-gray-100">
                                    {currentQ.content}
                                </div>

                                {currentQ.options && currentQ.options.length > 0 ? (
                                    <div className="grid gap-3 max-w-3xl">
                                        {currentQ.options.map((opt, i) => {
                                            const isSelected = userAnswers[currentQ.id] === opt;
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => handleOptionSelect(opt)}
                                                    className={`
                                                        group relative flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                                                        ${isSelected
                                                            ? 'border-cyan-500 bg-cyan-950/20'
                                                            : 'border-white/10 hover:border-white/30 bg-[#252525]'
                                                        }
                                                    `}
                                                >
                                                    {/* Radio Circle */}
                                                    <div className={`
                                                        w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                        ${isSelected ? 'border-cyan-500' : 'border-gray-500 group-hover:border-gray-300'}
                                                    `}>
                                                        {isSelected && <div className="w-3 h-3 rounded-full bg-cyan-400" />}
                                                    </div>

                                                    <span className={`text-lg ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                        {opt}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* NUMERICAL INPUT */
                                    <div className="max-w-xs">
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <div className="text-sm text-gray-400 mb-2">My Answer:</div>
                                            <div className="bg-black/40 border border-white/20 rounded h-12 flex items-center px-4 text-2xl font-mono text-cyan-400 tracking-wider mb-4">
                                                {userAnswers[currentQ.id] || ''}<span className="animate-pulse w-0.5 h-6 bg-cyan-500 ml-1" />
                                            </div>

                                            {/* Virtual Keypad */}
                                            <div className="grid grid-cols-3 gap-2">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'Backspace'].map((btn) => (
                                                    <button
                                                        key={btn}
                                                        onClick={() => {
                                                            const prev = String(userAnswers[currentQ.id] || '');
                                                            if (btn === 'Backspace') {
                                                                handleOptionSelect(prev.slice(0, -1));
                                                            } else {
                                                                if (btn === '.' && prev.includes('.')) return;
                                                                if (prev.length > 8) return;
                                                                handleOptionSelect(prev + btn);
                                                            }
                                                        }}
                                                        className={`h-12 rounded font-mono font-bold text-lg hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center
                                                            ${btn === 'Backspace' ? 'bg-red-900/20 text-red-400 border border-red-900/30' : 'bg-white/5 text-white border border-white/10'}
                                                        `}
                                                    >
                                                        {btn === 'Backspace' ? <X className="w-5 h-5" /> : btn}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <PageLoader message="Loading Question..." />
                            </div>
                        )}
                    </div>

                    {/* BOTTOM NAV BAR (FIXED) */}
                    <div className="h-20 bg-[#252525] border-t border-white/10 px-6 flex items-center justify-between shrink-0 z-10">
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="bg-white/5 border-white/10 hover:bg-white/10"
                                onClick={markForReview}
                            >
                                <div className="rounded-full bg-purple-500 h-3 w-3 mr-2" />
                                Mark for Review & Next
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-white/5 border-white/10 hover:bg-white/10"
                                onClick={clearResponse}
                            >
                                Clear Response
                            </Button>
                        </div>

                        <Button
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 h-12 text-lg rounded shadow-lg shadow-cyan-900/20"
                            onClick={saveAndNext}
                        >
                            Save & Next
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </main>

                {/* --- RIGHT SIDEBAR (PALETTE) --- */}
                <aside className={`
                    w-80 bg-[#252525] border-l border-white/10 flex flex-col shrink-0 transition-all duration-300
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full shadow-2xl'}
                `}>
                    <div className="p-4 border-b border-white/10 bg-[#2d2d2d] flex items-center justify-between">
                        <h3 className="font-bold text-gray-200 flex items-center gap-2">
                            <Menu className="w-4 h-4" /> Question Palette
                        </h3>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">Answered</span>
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">Not Ans</span>
                        </div>
                    </div>

                    {/* Palette Grid */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-3">
                            {/* We usually need exactly total questions, but here it's adaptive/streaming. 
                                So we show fetched + placeholders or just fetched? 
                                User asked for "Official Layout", usually 30-90 Qs. 
                                Let's show currently available + some future placeholders if known, 
                                but simpler to just show what we have + next available slot. 
                            */}
                            {questions.map((q, idx) => {
                                const status = questionStatus[q.id] || STATUS.NOT_VISITED;
                                const isCurrent = currentQuestionIndex === idx;
                                const style = getStatusColor(status);

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => handlePaletteClick(idx)}
                                        className={`
                                            h-10 w-10 rounded font-bold text-sm flex items-center justify-center relative transition-transform hover:scale-105
                                            ${style}
                                            ${isCurrent ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#252525] z-10' : ''}
                                            ${status === STATUS.ANSWERED_MARKED_REVIEW ? 'after:content-["✔"] after:absolute after:-top-1 after:-right-1 after:text-[10px] after:bg-green-500/80 after:rounded-full after:w-3 after:h-3 after:flex after:justify-center after:items-center' : ''}
                                        `}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 space-y-3 p-4 bg-black/20 rounded-lg border border-white/5 mx-auto text-xs text-gray-400">
                            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-green-500 rounded" /> Answered</div>
                            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-500 rounded" /> Not Answered</div>
                            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-white/10 border border-white/20 rounded" /> Not Visited</div>
                            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-purple-600 rounded" /> Marked for Review</div>
                            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-purple-600 rounded relative"><div className="absolute -top-1 -right-1 bg-green-500 w-2 h-2 rounded-full" /></div> Ans & Marked for Review</div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="p-4 border-t border-white/10 bg-[#2d2d2d]">
                        <Button className="w-full bg-cyan-700 hover:bg-cyan-600 text-white py-3 font-semibold tracking-wide">
                            Submit Test
                        </Button>
                    </div>
                </aside>

                {/* Toggle Sidebar Button (Mobile/Desktop) */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#2d2d2d] p-1 rounded-l-lg border border-r-0 border-white/10 text-gray-400 hover:text-white z-30"
                >
                    {isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>
        </div>
    );
}