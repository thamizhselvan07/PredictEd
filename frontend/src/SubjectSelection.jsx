import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getSubjects, startQuizSession } from './api';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Atom, Dna, Target } from 'lucide-react'; // Generic icons
import { useNavigate, useParams } from 'react-router-dom';

const iconMap = {
    "Physics": Atom,
    "Chemistry": Atom, // Reuse for simplicity or add Flask icon
    "Biology (Botany & Zoology)": Dna,
    "default": Book
};

export default function SubjectSelection() {
    const { examId } = useParams();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getSubjects(examId).then(res => {
            setSubjects(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [examId]);

    if (loading) return <PageLoader message="Loading Subjects..." />;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[128px] pointer-events-none" />

            <Navbar />
            <div className="max-w-6xl mx-auto p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                        <ArrowRight className="rotate-180 w-4 h-4" /> Back to Exams
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-brand">
                        Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Subject</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Dive deep into specific subjects to master concepts and practice focused drills.
                    </p>
                </motion.div>

                {/* Final Mock Call to Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 w-full"
                >
                    <button
                        onClick={async () => {
                            const subjectId = subjects.length > 0 ? subjects[0].id : 1;
                            try {
                                const res = await startQuizSession(subjectId, 'full', 1, null, 'final_mock');
                                if (res.data && res.data.attempt_id) {
                                    navigate(`/quiz/${res.data.attempt_id}`);
                                }
                            } catch (e) {
                                console.error(e);
                                alert("Failed to start mock exam");
                            }
                        }}
                        className="w-full relative group overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all shadow-glow hover:shadow-glow-lg"
                    >
                        <div className="flex items-center gap-4 text-left z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                                <Target className="w-8 h-8 animate-pulse-slow" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Final Overall Mock Test</h3>
                                <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                                    AI-Generated 50-Question Exam targeting your weak areas. Based on the official {examId ? examId.toUpperCase() : 'Exam'} pattern.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-primary text-black px-8 py-3 rounded-xl font-bold text-lg group-hover:scale-105 transition-transform z-10">
                            Start Exam <ArrowRight className="w-5 h-5" />
                        </div>

                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {subjects.map((sub, i) => {
                        // Simple heuristic for icons
                        let Icon = iconMap['default'];
                        if (sub.name.includes('Physics')) Icon = Atom;
                        if (sub.name.includes('Bio')) Icon = Dna;

                        return (
                            <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 rounded-3xl border border-white/5 hover:border-primary/50 cursor-pointer text-center group transition-all duration-300 hover:shadow-glow hover:-translate-y-2 bg-black/20"
                                onClick={() => navigate(`/exam/${examId}/subject/${sub.id}/topics`)}
                            >
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary/20 group-hover:scale-110 transition-all duration-500 shadow-inner border border-white/5">
                                    <Icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{sub.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold group-hover:text-foreground transition-colors">Start Learning</p>

                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <span className="font-bold">Enter</span> <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
