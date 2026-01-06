import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, MessageSquare, BookOpen, Trophy, Zap, Flame, FileText, Home } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';
import ThemeToggle from './ThemeToggle';
import ProfileButton from './ProfileButton';
import Logo from '../assets/logo.png';

export default function Navbar() {
    const location = useLocation();
    const { level, streak, progressToNextLevel } = useGamification();

    const navItems = [
        { name: 'Home', path: '/home', icon: Home },
        { name: 'Streams', path: '/streams', icon: BookOpen },
        { name: 'Syllabus', path: '/syllabus', icon: FileText },
        { name: 'Knowledge Graph', path: '/graph', icon: BrainCircuit },
        { name: 'Progress', path: '/dashboard', icon: LayoutDashboard },
        { name: 'AI Tutor', path: '/chat', icon: MessageSquare },
    ];

    return (
        <nav className="border-b border-white/5 bg-background/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <img src={Logo} alt="PredictEd" className="h-10 w-10 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 mix-blend-screen" />
                        </div>
                        <span className="text-2xl font-bold font-brand bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary tracking-wide group-hover:text-glow transition-all">
                            PredictEd
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        {/* Gamification Stats Pill */}
                        <div className="hidden lg:flex items-center gap-5 mr-4 bg-white/5 px-6 py-2 rounded-full border border-white/10 shadow-inner backdrop-blur-sm hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-2 group cursor-default" title="Current Level">
                                <Trophy className="h-4 w-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                                <span className="font-bold text-sm text-foreground/90">Lvl {level}</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-2 group cursor-default" title="XP Progress">
                                <Zap className="h-4 w-4 text-primary group-hover:text-primary-light transition-colors" />
                                <span className="font-mono text-xs text-primary">{Math.round(progressToNextLevel)}%</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-2 group cursor-default" title="Daily Streak">
                                <Flame className="h-4 w-4 text-orange-500 group-hover:text-orange-400 animate-pulse-slow" />
                                <span className="font-bold text-sm text-orange-400">{streak}</span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${isActive
                                            ? 'text-primary bg-primary/10 shadow-glow'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {isActive && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-glow mb-1" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pl-4 border-l border-white/10 flex items-center">
                            <ThemeToggle />
                            <ProfileButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
