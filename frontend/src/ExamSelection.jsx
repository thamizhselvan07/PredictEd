import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getExams, startMockExam } from './api';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './components/Button';

export default function ExamSelection() {
    const { streamId } = useParams();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleStartMock = (examId) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || 1;

        startMockExam(examId, userId).then(res => {
            navigate(`/quiz/${res.data.attempt_id}`);
        }).catch(err => {
            console.error("Failed to start mock", err);
            alert("Could not start mock exam.");
        });
    };

    useEffect(() => {
        getExams(streamId).then(res => {
            setExams(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [streamId]);

    if (loading) return <PageLoader message="Loading Exams..." />;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] pointer-events-none" />

            <Navbar />
            <div className="max-w-6xl mx-auto p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                        <ArrowRight className="rotate-180 w-4 h-4" /> Back to Streams
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-brand">
                        Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Entrance Exam</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Choose your target competitive exam to access specialized mock tests and adaptive quizzes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card glass-card p-8 rounded-3xl border border-white/5 hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden group hover:shadow-glow-lg hover:-translate-y-1"
                            onClick={() => navigate(`/exam/${exam.id}`)}
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500" />

                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{exam.name}</h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed max-w-sm">{exam.description || "Comprehensive preparation module."}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                    <BookOpen className="h-8 w-8 text-primary opacity-80" />
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-4 relative z-10">
                                <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform">
                                    Explore Subjects <ArrowRight className="ml-2 h-5 w-5" />
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        onClick={() => handleStartMock(exam.id)}
                                        variant="outline"
                                        className="w-full bg-white/5 border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all font-bold"
                                    >
                                        Take Full Mock Exam
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
