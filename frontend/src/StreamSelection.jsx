import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getStreams } from './api';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Stethoscope, Scale, Briefcase } from 'lucide-react';
import { Button } from './components/Button';
import { useNavigate } from 'react-router-dom';

const iconMap = {
    "Cpu": Cpu,
    "Stethoscope": Stethoscope,
    "Scale": Scale,
    "Briefcase": Briefcase,
    "default": Cpu
};

export default function StreamSelection() {
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getStreams().then(res => {
            setStreams(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <PageLoader message="Loading Career Streams..." />;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold mb-4">
                        Choose Your <span className="gradient-text">Career Path</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Select the competitive stream you are preparing for.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {streams.map((stream, i) => {
                        const Icon = iconMap[stream.icon] || iconMap['default'];
                        return (
                            <motion.div
                                key={stream.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/stream/${stream.id}`)}
                            >
                                <div className="glass-card p-8 rounded-2xl border border-primary/10 hover:border-primary/50 transition-all h-full flex flex-col items-center text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="h-8 w-8 text-primary" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">{stream.name}</h3>

                                    <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-primary flex items-center gap-2 text-sm font-semibold">
                                            View Exams <ArrowRight className="h-4 w-4" />
                                        </span>
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
