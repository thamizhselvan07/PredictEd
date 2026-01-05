import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Trophy, Star, Users, Flame, Medal, Crown, Target, Zap, BookOpen } from 'lucide-react';
import Logo from './assets/logo.png';

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
        <div className="min-h-screen bg-background text-foreground pb-20 flex flex-col">
            <Navbar />

            {/* Main Content Container */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* SECTION 1: HERO / STUDENT MILESTONE BANNER */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-primary/20 p-8 md:p-12">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium font-brand">
                                <img src={Logo} alt="Logo" className="w-4 h-4" /> PredictEd
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Champion!</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Your journey to mastery is going strong. Track your milestones, compete with peers, and conquer your exams.
                            </p>
                        </div>
                        {/* Hero Illustration Placeholder */}
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                                <div className="relative bg-card border border-border p-6 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-300">
                                    <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                                    <div className="text-center font-bold">Daily Goal</div>
                                    <div className="text-center text-sm text-muted-foreground">85% Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: STUDENT MILESTONE CARDS */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Medal className="w-6 h-6 text-yellow-500" /> Learning Milestones
                        </h2>
                        <span className="text-sm text-muted-foreground">View All</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {MILESTONES.map((milestone) => (
                            <div
                                key={milestone.id}
                                className={`p-4 rounded-xl border ${milestone.achieved ? 'bg-card border-primary/50 shadow-glow' : 'bg-muted/30 border-border'} transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${milestone.achieved ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <Star className={`w-6 h-6 ${milestone.achieved ? 'fill-current' : ''}`} />
                                </div>
                                <h3 className={`font-bold ${milestone.achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {milestone.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">{milestone.desc}</p>
                                {milestone.achieved && (
                                    <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary">Unlocked</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* SECTION 3: LEADERBOARD */}
                    <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-500" /> Leaderboard
                            </h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">Weekly</span>
                                <span className="px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted rounded-full cursor-pointer">All Time</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {LEADERBOARD_DATA.map((user, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-4 p-4 rounded-xl border ${idx < 3 ? 'bg-muted/30 border-primary/20' : 'bg-background border-border'} hover:border-primary/50 transition-colors`}
                                >
                                    <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${idx < 3 ? 'bg-yellow-500/20 text-yellow-500' : 'text-muted-foreground'}`}>
                                        #{user.rank}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
                                    <div className="flex-1">
                                        <div className="font-bold text-foreground">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">{user.badge}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary">{user.score} XP</div>
                                        {idx === 0 && <Crown className="w-4 h-4 text-yellow-500 inline ml-1" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: CURRENT USER RANK PANEL */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Medal className="w-32 h-32 rotate-12" />
                            </div>

                            <h2 className="text-xl font-bold mb-6 relative z-10">Your Performance</h2>

                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                                    <span className="text-2xl font-bold text-primary">{level}</span>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Current Level</div>
                                    <div className="text-2xl font-bold">Scholar</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                <div className="bg-background/60 backdrop-blur p-4 rounded-xl text-center border border-white/5">
                                    <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{streak}</div>
                                    <div className="text-xs text-muted-foreground">Day Streak</div>
                                </div>
                                <div className="bg-background/60 backdrop-blur p-4 rounded-xl text-center border border-white/5">
                                    <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold">85%</div>
                                    <div className="text-xs text-muted-foreground">Accuracy</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-card border border-border p-5 rounded-2xl">
                            <h3 className="font-bold mb-4 text-sm text-muted-foreground uppercase">Next Goals</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="flex-1">Complete "Thermodynamics"</span>
                                    <span className="text-muted-foreground">+50 XP</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    <span className="flex-1">Reach Level {level + 1}</span>
                                    <span className="text-muted-foreground">200 XP</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: REAL-TIME USER COUNT */}
                <section className="pt-8 border-t border-border mt-12 mb-8">
                    <div className="flex items-center justify-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-lg font-medium text-muted-foreground">
                            <span className="font-bold text-foreground overflow-hidden inline-block align-bottom min-w-[60px]">
                                {activeUsers.toLocaleString()}
                            </span>
                            active learners using PredictEd
                        </p>
                    </div>
                </section>

            </main>
        </div>
    );
}
