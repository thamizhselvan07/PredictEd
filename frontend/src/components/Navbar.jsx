import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, MessageSquare, BookOpen, Trophy, Zap, Flame, FileText, Home } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';
import ThemeToggle from './ThemeToggle';
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
        <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src={Logo} alt="Progress Here" className="h-8 w-8 object-contain transition-transform group-hover:scale-110 mix-blend-screen" />
                        <span className="text-xl font-bold font-brand bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            PredictEd
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center gap-4 mr-4 bg-muted/30 px-4 py-1.5 rounded-full border border-white/5">
                            <div className="flex items-center gap-1.5" title="Current Level">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="font-bold text-sm">Lvl {level}</span>
                            </div>
                            <div className="h-4 w-[1px] bg-border" />
                            <div className="flex items-center gap-1.5" title="XP Progress">
                                <Zap className="h-4 w-4 text-blue-400" />
                                <span className="font-mono text-xs">{Math.round(progressToNextLevel)}%</span>
                            </div>
                            <div className="h-4 w-[1px] bg-border" />
                            <div className="flex items-center gap-1.5" title="Daily Streak">
                                <Flame className="h-4 w-4 text-orange-500 box-shadow-glow" />
                                <span className="font-bold text-sm text-orange-400">{streak}</span>
                            </div>
                        </div>

                        <ThemeToggle />

                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
