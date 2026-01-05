import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getSubjects } from './api';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Atom, Dna } from 'lucide-react'; // Generic icons
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
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground mb-4">
                        ← Back to Exams
                    </button>
                    <h1 className="text-3xl font-bold mb-2">
                        Select <span className="gradient-text">Subject</span>
                    </h1>
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
                                className="glass-card p-6 rounded-xl border hover:border-primary/50 cursor-pointer text-center group"
                                onClick={() => navigate(`/subject/${sub.id}`)}
                            >
                                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{sub.name}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Start Learning</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
