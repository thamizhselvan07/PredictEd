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
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground mb-4">
                        ← Back to Streams
                    </button>
                    <h1 className="text-3xl font-bold mb-2">
                        Select <span className="gradient-text">Entrance Exam</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card glass-card p-6 rounded-2xl border border-primary/20 hover:border-primary transition-all cursor-pointer relative overflow-hidden group"
                            onClick={() => navigate(`/exam/${exam.id}`)}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{exam.name}</h3>
                                    <p className="text-muted-foreground mb-4">{exam.description}</p>
                                </div>
                                <BookOpen className="h-8 w-8 text-primary opacity-50" />
                            </div>

                            <div className="mt-4 flex flex-col gap-3">
                                <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                                    Explore Subjects <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        onClick={() => handleStartMock(exam.id)}
                                        variant="outline"
                                        className="w-full text-xs border-primary/50 hover:bg-primary/10 z-10 relative"
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
