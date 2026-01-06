import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Trophy, Star, Users, Flame, Medal, Crown, Target, Zap, BookOpen, Activity, ArrowRight, Rocket, Atom, Bot, Sparkles, Ghost } from 'lucide-react';
import Logo from './assets/logo.png';
import { motion } from 'framer-motion';

// SAFE MOCK DATA - Guaranteed to render
const MOCK_USER = {
    name: "User",
    rank: 42,
    level: 5,
    streak: 12,
    xp: 2850
};

const LEADERBOARD_DATA = [
    { rank: 1, name: "Sneha Gupta", score: 2850, badge: "Grandmaster" },
    { rank: 2, name: "Rahul Verma", score: 2720, badge: "Master" },
    { rank: 3, name: "Amit Kumar", score: 2680, badge: "Diamond" },
    { rank: 4, name: "Priya Singh", score: 2540, badge: "Platinum" },
    { rank: 5, name: "Vikram Raj", score: 2490, badge: "Gold" },
];

// Sticker Configuration for Leaderboard
const STICKERS = [
    { Icon: Rocket, bg: "from-blue-500/20 to-cyan-500/20", color: "text-cyan-400" },
    { Icon: Zap, bg: "from-yellow-500/20 to-orange-500/20", color: "text-yellow-400" },
    { Icon: Bot, bg: "from-purple-500/20 to-pink-500/20", color: "text-pink-400" },
    { Icon: Target, bg: "from-green-500/20 to-emerald-500/20", color: "text-emerald-400" },
    { Icon: Ghost, bg: "from-indigo-500/20 to-purple-500/20", color: "text-indigo-400" },
];

const MILESTONES = [
    { id: 1, title: "Beginner", desc: "Started Journey", achieved: true, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { id: 2, title: "Scholar", desc: "5 Quizzes Done", achieved: true, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { id: 3, title: "Achiever", desc: "Top 10% Rank", achieved: false, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { id: 4, title: "Master", desc: "Perfect Streak", achieved: false, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { id: 5, title: "Legend", desc: "Community Leader", achieved: false, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
];

export default function Home() {
    // Local state for active users to ensure no external dependency fails
    const [activeUsers, setActiveUsers] = useState(12450);

    // Safety check: attempt to get gamification context, fallback to mocks if fails
    // We are NOT using the hook directly to prevent crashes if context is missing
    const level = localStorage.getItem('student_xp') ? Math.floor(parseInt(localStorage.getItem('student_xp')) / 100) + 1 : MOCK_USER.level;
    const streak = localStorage.getItem('student_streak') || MOCK_USER.streak;

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 flex flex-col relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

            <Navbar />

            {/* Main Content Container */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">

                {/* SECTION 1: HERO / STUDENT MILESTONE BANNER */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-background/50 to-secondary/10 border border-white/10 p-8 md:p-12 glass-card backdrop-blur-md"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-6 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold font-brand uppercase tracking-wider shadow-glow">
                                <img src={Logo} alt="Logo" className="w-4 h-4" /> PredictEd AI
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-brand">
                                Welcome back,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-secondary animate-pulse-slow">Champion!</span>
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Your adaptive learning engine is calibrated. Track your milestones, compete with peers, and conquer your exams with AI precision.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-primary text-black font-bold rounded-xl shadow-glow hover:bg-primary-dark transition-colors">
                                    Resume Learning
                                </motion.button>
                            </div>
                        </div>
                        {/* Hero Illustration Placeholder */}
                        <div className="w-full md:w-1/3 flex justify-center perspective-1000">
                            <motion.div
                                animate={{ rotate: [3, -3, 3], y: [0, -10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-56 h-56"
                            >
                                <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-pulse" />
                                <div className="relative bg-black/40 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
                                    <Target className="w-20 h-20 text-primary mx-auto mb-4" />
                                    <div className="text-center font-bold text-2xl mb-1">Daily Goal</div>
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                                    </div>
                                    <div className="text-center text-sm text-primary font-mono">85% Complete</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION 2: STUDENT MILESTONE CARDS */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2 font-brand">
                            <Medal className="w-6 h-6 text-primary" /> Learning Milestones
                        </h2>
                        <span className="text-sm text-primary hover:text-white cursor-pointer transition-colors font-medium">View All Awards</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {MILESTONES.map((milestone) => (
                            <motion.div
                                key={milestone.id}
                                whileHover={{ y: -5 }}
                                className={`p-5 rounded-2xl border ${milestone.achieved ? 'glass-card bg-primary/5 border-primary/30 shadow-glow' : 'bg-white/5 border-white/5 opacity-70'} transition-all duration-300 relative overflow-hidden group`}
                            >
                                {milestone.achieved && <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full -mr-10 -mt-10" />}

                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${milestone.achieved ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg' : 'bg-white/10 text-muted-foreground'}`}>
                                    <Star className={`w-6 h-6 ${milestone.achieved ? 'fill-current' : ''}`} />
                                </div>
                                <h3 className={`font-bold font-brand text-lg ${milestone.achieved ? 'text-white' : 'text-muted-foreground'}`}>
                                    {milestone.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">{milestone.desc}</p>
                                {milestone.achieved && (
                                    <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                                        Unlocked <CheckCircleIcon className="w-3 h-3" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* SECTION 3: LEADERBOARD */}
                    <div className="lg:col-span-8 glass-card border border-white/10 rounded-3xl p-8 shadow-glass bg-black/40">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2 font-brand">
                                <Trophy className="w-6 h-6 text-yellow-500" /> Global Leaderboard
                            </h2>
                            <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/5">
                                <span className="px-4 py-1.5 text-xs font-bold bg-primary text-black rounded-full shadow-glow cursor-pointer">Weekly</span>
                                <span className="px-4 py-1.5 text-xs font-bold text-muted-foreground hover:text-white rounded-full cursor-pointer transition-colors">All Time</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {LEADERBOARD_DATA.map((user, idx) => {
                                const sticker = STICKERS[idx % STICKERS.length];
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex items-center gap-6 p-4 rounded-2xl border ${idx < 3 ? 'bg-gradient-to-r from-white/5 to-transparent border-primary/20' : 'bg-transparent border-white/5'} hover:border-primary/50 transition-colors group relative overflow-hidden`}
                                    >
                                        {idx === 0 && <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />}

                                        <div className={`w-10 h-10 flex items-center justify-center font-black text-lg rounded-full shrink-0 ${idx === 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-700' : 'text-muted-foreground'}`}>
                                            #{user.rank}
                                        </div>

                                        {/* Profile Sticker (Replaced Empty Div) */}
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${sticker.bg} flex items-center justify-center border-2 border-white/10 shadow-lg shrink-0`}>
                                            <sticker.Icon className={`w-6 h-6 ${sticker.color}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-lg text-white group-hover:text-primary transition-colors truncate">{user.name}</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{user.badge}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="font-bold text-xl text-white font-mono">{user.score} <span className="text-primary text-sm">XP</span></div>
                                            {idx === 0 && <Crown className="w-4 h-4 text-yellow-500 inline ml-1 animate-pulse" />}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    {/* SECTION 4: CURRENT USER RANK PANEL */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card bg-gradient-to-b from-primary/10 to-transparent border border-primary/30 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                                <Medal className="w-40 h-40 rotate-12 text-primary" />
                            </div>

                            <h2 className="text-xl font-bold mb-8 relative z-10 font-brand">Your Performance</h2>

                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-black/40 flex items-center justify-center border border-primary/50 shadow-glow relative">
                                    <span className="text-3xl font-bold text-white">{level}</span>
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full">LVL</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Current Rank</div>
                                    <div className="text-3xl font-bold text-white">Scholar</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl text-center border border-white/10 hover:border-orange-500/50 transition-colors">
                                    <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">{streak}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</div>
                                </div>
                                <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl text-center border border-white/10 hover:border-blue-500/50 transition-colors">
                                    <Activity className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">85%</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="glass-card border border-white/10 p-6 rounded-3xl bg-black/40">
                            <h3 className="font-bold mb-5 text-xs text-muted-foreground uppercase tracking-widest">Next Objectives</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 text-sm group cursor-pointer">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] group-hover:scale-150 transition-transform" />
                                    <span className="flex-1 text-gray-300 group-hover:text-white transition-colors">Complete "Thermodynamics"</span>
                                    <span className="text-primary font-mono text-xs">+50 XP</span>
                                </li>
                                <li className="flex items-center gap-4 text-sm group cursor-pointer">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] group-hover:scale-150 transition-transform" />
                                    <span className="flex-1 text-gray-300 group-hover:text-white transition-colors">Reach Level {level + 1}</span>
                                    <span className="text-primary font-mono text-xs">+200 XP</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: REAL-TIME USER COUNT */}
                <section className="pt-8 border-t border-white/5 mt-12 mb-8">
                    <div className="flex items-center justify-center gap-4 py-4 px-8 rounded-full bg-white/5 border border-white/5 w-fit mx-auto backdrop-blur-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                        </span>
                        <p className="text-sm font-medium text-muted-foreground">
                            <span className="font-bold text-white font-mono text-lg">{activeUsers.toLocaleString()}</span>
                            <span className="ml-2">active learners online</span>
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
}

function CheckCircleIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
