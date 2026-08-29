import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import { BrainCircuit, Target, Clock, Zap, AlertTriangle, ArrowRight, ShieldAlert, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Card } from './components/Card';

export default function MockTests() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const startTest = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/mock-tests/generate', { method: 'POST' });
            const data = await res.json();
            navigate(`/quiz/${data.attempt_id}`);
        } catch (err) {
            console.error(err);
            navigate('/quiz/1'); // Fallback
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 z-0"></div>
            <Navbar />
            <div className="flex-1 p-6 z-10 max-w-7xl mx-auto w-full space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Adaptive Mock Tests
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">Tests that adapt to what you actually need to learn.</p>
                    </div>
                    <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-2 flex items-center gap-2 w-fit">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-sm font-bold text-primary tracking-widest uppercase">AI Engine Online</span>
                    </div>
                </div>

                {/* Section 1: AI Recommended */}
                <section>
                    <h2 className="text-xl font-bold font-orbitron mb-4 text-primary flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5" /> RECOMMENDED FOR YOU
                    </h2>
                    <motion.div whileHover={{ scale: 1.01 }} className="relative bg-surface/50 border border-primary rounded-2xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.15)] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="grid md:grid-cols-3 gap-6 relative z-10">
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-3xl font-bold font-orbitron">Physics Diagnostic Test</h3>
                                <div className="flex flex-wrap gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-1 text-primary"><Zap className="w-4 h-4"/> Adaptive Difficulty</div>
                                    <div className="flex items-center gap-1 text-muted-foreground"><CheckCircle2 className="w-4 h-4"/> 20 Questions</div>
                                    <div className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4"/> 25 Minutes</div>
                                </div>
                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4 text-sm">
                                    <strong className="text-primary block mb-1">AI REASON:</strong>
                                    Recommended because your recent performance shows weakness in Modern Physics and Thermodynamics.
                                </div>
                            </div>
                            <div className="flex flex-col justify-center gap-3">
                                <button onClick={startTest} disabled={loading} className={`w-full py-3 bg-primary text-primary-foreground font-bold font-orbitron rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex justify-center items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}>
                                    {loading ? 'GENERATING AI TEST...' : <><span className="mr-2">START TEST</span><ArrowRight className="w-5 h-5"/></>}
                                </button>
                                <button className="w-full py-3 bg-surface border border-primary text-primary font-bold font-orbitron rounded-xl hover:bg-primary/10 transition-all">
                                    WHY THIS?
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-10">
                        {/* Section 2: Categories */}
                        <section>
                            <h2 className="text-xl font-bold font-orbitron mb-4 text-foreground">Test Categories</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <CategoryCard title="Diagnostic Test" desc="Assess baseline knowledge." icon={<Target/>} time="30m" q="30" diff="Mixed" />
                                <CategoryCard title="Adaptive Mock" desc="Continuously adjusts to you." icon={<BrainCircuit/>} time="45m" q="40" diff="Adaptive" />
                                <CategoryCard title="Full Mock Exam" desc="Standardized full length." icon={<BarChart3/>} time="120m" q="100" diff="Hard" />
                                <CategoryCard title="Weak Topic Test" desc="Focuses strictly on gaps." icon={<ShieldAlert/>} time="20m" q="15" diff="Medium" />
                            </div>
                        </section>
                    </div>

                    <div className="space-y-10">
                        {/* Section 3: Recent Performance */}
                        <section>
                            <h2 className="text-xl font-bold font-orbitron mb-4 text-foreground">Recent Performance</h2>
                            <div className="bg-surface/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                                <div className="flex justify-between items-end border-b border-border/50 pb-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground uppercase tracking-wider">Last Mock Score</div>
                                        <div className="text-3xl font-bold text-foreground">72%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-muted-foreground uppercase tracking-wider">Accuracy</div>
                                        <div className="text-xl font-bold text-success">74%</div>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Topics Improved</div>
                                        <div className="text-sm font-medium text-success">Units & Measurements, Kinematics</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Needs Attention</div>
                                        <div className="text-sm font-medium text-destructive">Modern Physics</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: AI Test Insight */}
                        <section>
                            <h2 className="text-xl font-bold font-orbitron mb-4 text-primary">AI Insight</h2>
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <SparklesIcon className="w-8 h-8 text-primary mb-4" />
                                <p className="text-sm text-foreground/90 mb-4">
                                    "Your last assessment revealed a significant weakness in Modern Physics. 
                                    PredictEd recommends reinforcement before attempting an advanced mock."
                                </p>
                                <button onClick={() => navigate('/learning-path')} className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    VIEW UPDATED PATH <ArrowRight className="w-4 h-4"/>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CategoryCard({ title, desc, icon, time, q, diff }) {
    return (
        <Card className="p-5 hover:border-primary/50 transition-colors group cursor-pointer bg-surface/30">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
                <div className="text-xs font-bold px-2 py-1 bg-white/5 rounded text-muted-foreground">{diff}</div>
            </div>
            <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-xs text-muted-foreground mb-4">{desc}</p>
            <div className="flex items-center gap-4 text-xs font-medium text-foreground/70">
                <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {q} Qs</div>
                <div className="flex items-center gap-1"><Clock className="w-3 h-3"/> {time}</div>
            </div>
        </Card>
    );
}

function SparklesIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
        </svg>
    )
}
