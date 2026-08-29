import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const LearningPath = () => {
    const [pathData, setPathData] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Mock data fetch for demo
        setTimeout(() => {
            setPathData({
                goal_name: 'AI Engineer',
                overall_progress: 18.5,
                estimated_completion: '14 weeks',
                steps: [
                    { id: 1, phase_order: 1, title: 'Python Foundations', step_type: 'course', description: 'Advanced Python for data science.', status: 'completed', estimated_time: '1 week', prerequisites: [], reasoning: 'Python is the core language for AI.' },
                    { id: 2, phase_order: 2, title: 'Linear Algebra', step_type: 'course', description: 'Matrix operations, vectors, eigenvectors.', status: 'current', estimated_time: '2 weeks', prerequisites: ['Python Foundations'], reasoning: 'Linear Algebra is a prerequisite for several ML concepts. Your current mastery is low.' },
                    { id: 3, phase_order: 3, title: 'Machine Learning', step_type: 'project', description: 'Build a Student Performance Predictor.', status: 'locked', estimated_time: '3 weeks', prerequisites: ['Linear Algebra', 'Probability'], reasoning: 'Your goal requires Machine Learning.' },
                    { id: 4, phase_order: 4, title: 'Deep Learning', step_type: 'course', description: 'Neural Networks, CNNs, RNNs.', status: 'locked', estimated_time: '4 weeks', prerequisites: ['Machine Learning', 'Calculus'], reasoning: 'Deep learning is essential for modern AI engineers.' },
                    { id: 5, phase_order: 5, title: 'MLOps & Deployment', step_type: 'course', description: 'Docker, Kubernetes, CI/CD for ML.', status: 'locked', estimated_time: '2 weeks', prerequisites: ['Deep Learning'], reasoning: 'Needed to deploy models in production.' }
                ]
            });
        }, 500);
    }, []);

    if (!pathData) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 z-0"></div>
            <Navbar />
            <div className="flex-1 p-6 z-10 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                            YOUR PATH TO {pathData.goal_name.toUpperCase()}
                        </h1>
                        <p className="text-muted-foreground mt-2">Estimated Completion: {pathData.estimated_completion}</p>
                    </div>
                    <div className="bg-surface/50 border border-primary/20 rounded-xl p-4 text-center backdrop-blur-sm">
                        <div className="text-2xl font-bold text-primary">{pathData.overall_progress}%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Completed</div>
                    </div>
                </div>

                <div className="mb-8 bg-surface/30 border border-border/50 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="font-orbitron text-lg font-bold mb-4 text-primary">WHY THIS PATH?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        This roadmap was generated from your career goal, current skills, assessment history, learning behavior, and prerequisite dependencies.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-surface/50 p-3 rounded-lg text-center"><div className="text-lg font-bold text-success">94%</div><div className="text-xs text-muted-foreground">GOAL MATCH</div></div>
                        <div className="bg-surface/50 p-3 rounded-lg text-center"><div className="text-lg font-bold text-success">87%</div><div className="text-xs text-muted-foreground">SKILL COVERAGE</div></div>
                        <div className="bg-surface/50 p-3 rounded-lg text-center"><div className="text-lg font-bold text-success">100%</div><div className="text-xs text-muted-foreground">PREREQUISITE VALIDATION</div></div>
                        <div className="bg-surface/50 p-3 rounded-lg text-center"><div className="text-lg font-bold text-success">91%</div><div className="text-xs text-muted-foreground">PERSONALIZATION</div></div>
                    </div>
                </div>

                <div className="relative border-l-2 border-border/30 ml-4 md:ml-8 space-y-12">
                    {pathData.steps.map((step, index) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Timeline Node */}
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-background ${step.status === 'completed' ? 'border-success bg-success/20' : step.status === 'current' ? 'border-primary bg-primary shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 'border-muted'}`}></div>
                            
                            <div className={`bg-surface/40 backdrop-blur-sm border rounded-xl p-6 transition-all hover:bg-surface/60 cursor-pointer ${step.status === 'current' ? 'border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'border-border/50'}`}
                                 onClick={() => setSelectedStep(selectedStep?.id === step.id ? null : step)}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">PHASE {step.phase_order} • {step.step_type}</div>
                                    {step.status === 'completed' && <span className="text-success text-sm">? Completed</span>}
                                    {step.status === 'current' && <span className="text-primary text-sm font-bold animate-pulse">? Current</span>}
                                    {step.status === 'locked' && <span className="text-muted-foreground text-sm flex items-center"><span className="mr-1">??</span> Locked</span>}
                                </div>
                                <h3 className={`text-xl font-orbitron font-bold ${step.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'}`}>{step.title}</h3>
                                <p className="text-muted-foreground text-sm mt-2">{step.description}</p>
                                
                                {step.status === 'locked' && step.prerequisites.length > 0 && (
                                    <div className="mt-4 text-xs text-destructive flex items-center">
                                        <span className="mr-1">??</span> Requires: {step.prerequisites.join(', ')}
                                    </div>
                                )}

                                <AnimatePresence>
                                    {selectedStep?.id === step.id && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-border/50 overflow-hidden"
                                        >
                                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                                                <h4 className="text-sm font-bold text-primary mb-2">AI REASONING</h4>
                                                <p className="text-sm text-foreground/80 mb-3">{step.reasoning}</p><div className="bg-background/50 rounded p-2"><div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Signals Evaluated:</div><ul className="text-xs text-foreground/70 space-y-1"><li className="flex items-center gap-1"><span className="text-success">?</span> Recent assessments analyzed</li><li className="flex items-center gap-1"><span className="text-success">?</span> Prerequisite dependency detected</li></ul></div>
                                            </div>
                                            {step.status === 'current' && (
                                                <button className="mt-4 w-full py-2 bg-primary/20 text-primary border border-primary/50 font-orbitron font-bold rounded hover:bg-primary hover:text-primary-foreground transition-all">
                                                    START MODULE
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
