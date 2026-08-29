import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { motion } from 'framer-motion';
import api from './api'; // assuming api is standard axios instance

const Onboarding = () => {
    const [goal, setGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Using mock timeout for demo, or real API if needed
            // Normally this would call: await api.post('/api/ai/onboarding', { user_id: 1, goal })
            setTimeout(() => {
                setProfile({
                    target_career: 'Machine Learning Engineer',
                    learning_pace: 'Fast',
                    available_time: '2 hrs/day',
                    strengths: ['Python', 'Statistics'],
                    skill_gaps: ['Linear Algebra', 'Machine Learning', 'Deep Learning', 'MLOps']
                });
                setIsGenerating(false);
            }, 1500);
        } catch (e) {
            console.error(e);
            setIsGenerating(false);
        }
    };

    const handleStartPath = () => {
        navigate('/learning-path');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50 z-0"></div>
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
                {!profile ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl w-full"
                    >
                        <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6 text-center drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                            Tell PredictEd where you want to go.
                        </h1>
                        <p className="text-muted-foreground text-center mb-8 text-lg">
                            Describe your ultimate career goal, current knowledge, and how much time you have. 
                            Our AI will build a personalized learning roadmap just for you.
                        </p>
                        
                        <div className="relative mb-8">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <textarea 
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="I want to become a machine learning engineer in 8 months and I currently know Python and basic mathematics..."
                                className="relative w-full h-40 bg-surface/80 backdrop-blur-md border border-border/50 rounded-xl p-6 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground"
                            />
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={!goal.trim() || isGenerating}
                            className="w-full py-4 bg-primary text-primary-foreground font-orbitron font-bold tracking-wider rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                    <span>ANALYZING GOAL...</span>
                                </>
                            ) : (
                                <span>GENERATE MY LEARNING PATH ?</span>
                            )}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl w-full"
                    >
                        <h2 className="text-3xl font-orbitron font-bold text-center mb-8 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] text-primary">
                            AI LEARNER PROFILE
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6">
                                <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Target</h3>
                                <div className="text-2xl font-bold text-foreground">{profile.target_career}</div>
                            </div>
                            <div className="bg-surface/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Learning Pace</h3>
                                    <div className="text-xl font-bold text-foreground">{profile.learning_pace}</div>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Daily Commitment</h3>
                                    <div className="text-xl font-bold text-foreground">{profile.available_time}</div>
                                </div>
                            </div>
                            
                            <div className="bg-surface/50 backdrop-blur-sm border border-success/30 rounded-xl p-6">
                                <h3 className="text-sm text-success uppercase tracking-wider mb-4 flex items-center"><span className="mr-2">?</span> Strong Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.strengths.map(s => (
                                        <span key={s} className="px-3 py-1 bg-success/10 border border-success/30 rounded-full text-sm">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-surface/50 backdrop-blur-sm border border-destructive/30 rounded-xl p-6">
                                <h3 className="text-sm text-destructive uppercase tracking-wider mb-4 flex items-center"><span className="mr-2">!</span> Skill Gaps</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skill_gaps.map(s => (
                                        <span key={s} className="px-3 py-1 bg-destructive/10 border border-destructive/30 rounded-full text-sm">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleStartPath}
                            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-orbitron font-bold tracking-wider rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                        >
                            VIEW PREREQUISITE ROADMAP
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
