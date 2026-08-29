import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { BrainCircuit, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostMockAnalysis() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 z-0"></div>
            <Navbar />
            <div className="flex-1 p-6 z-10 max-w-4xl mx-auto w-full space-y-8 flex flex-col justify-center">
                
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 text-success mb-2 border-2 border-success/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-success to-primary">
                        MOCK TEST COMPLETE
                    </h1>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center bg-surface/50 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
                    <div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Score</div>
                        <div className="text-3xl font-bold">72%</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Accuracy</div>
                        <div className="text-3xl font-bold text-success">74%</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Avg Response</div>
                        <div className="text-3xl font-bold">41 sec</div>
                    </div>
                </div>

                <div className="bg-surface/50 border border-primary/30 rounded-2xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-bold font-orbitron text-primary mb-6 flex items-center gap-2"><BrainCircuit /> AI PERFORMANCE ANALYSIS</h2>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-success/10 border border-success/30 rounded-xl p-4">
                            <div className="text-sm font-bold text-success uppercase tracking-wider mb-2">STRONG</div>
                            <div className="text-lg">Units & Measurements <span className="text-success font-bold float-right">88%</span></div>
                        </div>
                        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                            <div className="text-sm font-bold text-warning uppercase tracking-wider mb-2" style={{color:'#f59e0b'}}>MODERATE</div>
                            <div className="text-lg">Laws of Motion <span className="text-warning font-bold float-right" style={{color:'#f59e0b'}}>64%</span></div>
                        </div>
                        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                            <div className="text-sm font-bold text-destructive uppercase tracking-wider mb-2">WEAK</div>
                            <div className="text-lg">Modern Physics <span className="text-destructive font-bold float-right">31%</span></div>
                        </div>
                    </div>

                    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-8">
                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI DETECTED</div>
                        <p className="text-sm text-foreground/90">"Your errors indicate a conceptual gap in Modern Physics rather than a general difficulty issue."</p>
                    </div>
                    
                    <div className="border-t border-border/50 pt-6">
                        <h3 className="text-lg font-bold font-orbitron text-foreground mb-4 flex items-center gap-2"><TrendingUp className="text-primary"/> LEARNING PATH UPDATED</h3>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm line-through text-muted-foreground"><span className="text-destructive font-bold">-</span> Removed: Advanced Modern Physics</div>
                            <div className="flex items-center gap-3 text-sm font-medium"><span className="text-success font-bold">+</span> Added: Modern Physics Fundamentals</div>
                            <div className="flex items-center gap-3 text-sm font-medium"><span className="text-success font-bold">+</span> Added: Photoelectric Effect Reinforcement</div>
                            <div className="flex items-center gap-3 text-sm font-medium"><span className="text-success font-bold">+</span> Added: 10 Adaptive Practice Questions</div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-surface border border-border/50 rounded-xl p-4">
                            <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Improvement</div>
                                <div className="text-xl font-bold text-success">+15%</div>
                            </div>
                            <button onClick={() => navigate('/learning-path')} className="py-2 px-6 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                                VIEW UPDATED PATH <ArrowRight className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
