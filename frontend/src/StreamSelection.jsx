import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getStreams } from './api';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Stethoscope, Scale, Briefcase, BadgeDollarSign, PenTool, Shield, GraduationCap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from './components/Card';

const iconMap = {
    "Cpu": Cpu,
    "Stethoscope": Stethoscope,
    "Scale": Scale,
    "Briefcase": Briefcase,
    "BadgeDollarSign": BadgeDollarSign,
    "PenTool": PenTool,
    "Shield": Shield,
    "GraduationCap": GraduationCap,
    "Building2": Building2,
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

    if (loading) return <PageLoader message="Initializing career paths..." />;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex justify-center mb-4">
                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono tracking-wider uppercase">
                            Career Trajectory
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-brand mb-6 tracking-tight">
                        Select Your <span className="gradient-text">Stream</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Identify your target specialization to configure the adaptive learning engine for your specific competitive landscape.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {streams.map((stream, i) => {
                        const Icon = iconMap[stream.icon] || iconMap['default'];
                        return (
                            <motion.div
                                key={stream.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02, translateY: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className="h-full cursor-pointer group relative overflow-hidden transition-all duration-300 border-white/5 hover:border-primary/50 bg-gradient-to-br from-card/80 to-card/40 hover:from-primary/10 hover:to-transparent"
                                    onClick={() => navigate(`/stream/${stream.id}`)}
                                >
                                    {/* Abstract glow background */}
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />

                                    <div className="p-8 flex flex-col items-center text-center relative z-10 space-y-6">

                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="relative w-20 h-20 rounded-2xl bg-surface-dark border border-white/10 group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 shadow-glass">
                                                <Icon className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300 font-brand tracking-wide mb-2">
                                                {stream.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                                Click to initialize {stream.name} module
                                            </p>
                                        </div>

                                        <div className="pt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            <span className="text-primary flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                                                Initialize <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bottom highlight line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
