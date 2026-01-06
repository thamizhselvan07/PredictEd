import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Trophy, Flame, Star, Activity, School, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';

export default function ProfileButton() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { xp, streak, level } = useGamification();

    // Mock Data with Safe Defaults (simulating user data)
    const userProfile = {
        gender: localStorage.getItem('user_gender') || 'Male', // Default to Male if unknown
        age: '19',
        institution: 'IIT Madras', // Placeholder
        quizzesAttended: 42,
        globalRank: 1205,
        localRank: 15,
        rating: 4.8
    };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Star Rating Component
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
            />
        ));
    };

    return (
        <div className="relative ml-4" ref={dropdownRef}>
            {/* Circular Profile Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center hover:bg-primary/20 hover:shadow-glow transition-all duration-300 group overflow-hidden"
            >
                {/* Avatar Sticker Logic */}
                {userProfile.gender === 'Female' ? (
                    <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-pink-400" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-cyan-400" />
                    </div>
                )}

                {/* Active Status Dot */}
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full border border-black shadow-[0_0_4px_#22c55e]" />
            </motion.button>

            {/* Glassmorphism Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header Section */}
                        <div className="p-5 border-b border-white/5 bg-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/10 shadow-inner ${userProfile.gender === 'Female' ? 'bg-pink-500/10' : 'bg-cyan-500/10'}`}>
                                    <User className={`w-7 h-7 ${userProfile.gender === 'Female' ? 'text-pink-400' : 'text-cyan-400'}`} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Student Profile</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                            Level {level} Scholar
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {/* Quizzes Attended */}
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                <Activity className="w-5 h-5 text-purple-400 mb-1" />
                                <span className="text-xl font-bold text-white">{userProfile.quizzesAttended}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Quizzes</span>
                            </div>

                            {/* Streak */}
                            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                <Flame className="w-5 h-5 text-orange-400 mb-1 animate-pulse-slow" />
                                <span className="text-xl font-bold text-white">{streak}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</span>
                            </div>
                        </div>

                        {/* Rank Info */}
                        <div className="px-4 pb-2">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Global Rank</div>
                                        <div className="font-bold text-white">#{userProfile.globalRank}</div>
                                    </div>
                                </div>
                                <div className="h-8 w-[1px] bg-white/10" />
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground">Local Rank</div>
                                    <div className="font-bold text-primary">#{userProfile.localRank}</div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <School className="w-4 h-4 text-primary" />
                                <span>{userProfile.institution}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>Age: {userProfile.age}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>India</span>
                            </div>
                        </div>

                        {/* Footer / Rating */}
                        <div className="p-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Student Rating</span>
                            <div className="flex gap-0.5">
                                {renderStars(userProfile.rating)}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
