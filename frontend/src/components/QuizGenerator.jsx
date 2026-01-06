
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { PageLoader } from './LoadingSpinner';
import { generatePdfQuiz } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, XCircle, ArrowRight, Brain, AlertTriangle } from 'lucide-react';

export default function QuizGenerator() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState(null); // { correct, correct_answer }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleGenerate = async () => {
        if (!file) {
            setError("Please select a PDF file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('num_questions', 5);

        try {
            const res = await generatePdfQuiz(formData);
            if (res.data.questions && res.data.questions.length > 0) {
                setQuestions(res.data.questions);
                setCurrentQuestionIndex(0);
                setScore(0);
                setShowResults(false);
            } else {
                setError("No questions could be generated. The PDF might be empty or unreadable.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (opt) => {
        if (feedback) return;
        setSelectedOption(opt);
    };

    const handleSubmitAnswer = () => {
        if (!selectedOption) return;

        const currentQ = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQ.correct_answer;

        setFeedback({
            correct: isCorrect,
            correct_answer: currentQ.correct_answer
        });

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setFeedback(null);
        setSelectedOption(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const reset = () => {
        setQuestions([]);
        setFile(null);
        setFeedback(null);
        setSelectedOption(null);
        setShowResults(false);
        setScore(0);
    };

    if (loading) return <PageLoader message="Analyzing document and generating neural links..." />;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header / Back Button */}
                <div className="mb-8 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                        &larr; Back to Dashboard
                    </Button>
                    <h1 className="text-2xl font-bold font-brand tracking-tight">AI Content Processor</h1>
                </div>

                <AnimatePresence mode="wait">
                    {/* Upload View */}
                    {questions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 blur-3xl" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <UploadCloud className="h-10 w-10 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Upload Study Material</h2>
                                <p className="text-muted-foreground mb-8 max-w-md">
                                    Upload a PDF document (notes, textbook, papers) and our AI will instantly generate a conceptual quiz to test your understanding.
                                </p>

                                <div className="space-y-6 w-full max-w-sm">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-500
                                        file:mr-4 file:py-3 file:px-6
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary/10 file:text-primary
                                        hover:file:bg-primary/20
                                        cursor-pointer"
                                    />

                                    {error && (
                                        <div className="flex items-center gap-2 text-error text-sm bg-error/10 p-3 rounded-lg">
                                            <AlertTriangle className="h-4 w-4" />
                                            {error}
                                        </div>
                                    )}

                                    <Button onClick={handleGenerate} size="lg" className="w-full" disabled={!file}>
                                        <Brain className="mr-2 h-5 w-5" /> Generate Quiz
                                    </Button>

                                    <div className="text-xs text-muted-foreground">
                                        Supported Formats: PDF (Max 10MB)
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : showResults ? (
                        /* Results View */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border border-white/10 rounded-3xl p-12 text-center"
                        >
                            <div className="h-24 w-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-12 w-12 text-success" />
                            </div>
                            <h2 className="text-4xl font-bold mb-2">Analysis Complete</h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                You scored <span className="text-primary font-bold">{score}</span> out of <span className="text-foreground">{questions.length}</span>
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={reset} variant="outline">Upload Another</Button>
                                <Button onClick={() => navigate('/dashboard')}>Finish</Button>
                            </div>
                        </motion.div>
                    ) : (
                        /* Quiz Taking View */
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
                                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span>Topic: {questions[currentQuestionIndex].topic || 'General'}</span>
                            </div>

                            <Card className="p-8 mb-6 border-primary/20 bg-background/50 backdrop-blur-md">
                                <h3 className="text-2xl font-bold leading-snug mb-8">
                                    {questions[currentQuestionIndex].question}
                                </h3>

                                <div className="grid gap-3">
                                    {questions[currentQuestionIndex].options.map((opt, i) => {
                                        const isCorrect = feedback && opt === feedback.correct_answer;
                                        const isWrong = feedback && opt === selectedOption && !feedback.correct;
                                        const isSelected = selectedOption === opt;
                                        const isDisabled = !!feedback;

                                        return (
                                            <button
                                                key={i}
                                                disabled={isDisabled}
                                                onClick={() => handleOptionSelect(opt)}
                                                className={`w-full p-4 text-left rounded-xl border transition-all ${isCorrect ? 'bg-success/20 border-success' :
                                                    isWrong ? 'bg-error/20 border-error' :
                                                        isSelected ? 'bg-primary/20 border-primary' :
                                                            'bg-card border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm ${isCorrect ? 'bg-success border-success text-black' :
                                                        isWrong ? 'bg-error border-error text-white' :
                                                            isSelected ? 'bg-primary border-primary text-black' :
                                                                'border-white/20'
                                                        }`}>
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                    <span className={isCorrect || isSelected ? 'font-semibold' : ''}>{opt}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Card>

                            <div className="flex justify-end">
                                {!feedback ? (
                                    <Button onClick={handleSubmitAnswer} disabled={!selectedOption} size="lg">
                                        Check Answer
                                    </Button>
                                ) : (
                                    <Button onClick={handleNextQuestion} size="lg">
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
