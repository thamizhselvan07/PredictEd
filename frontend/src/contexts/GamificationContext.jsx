import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const GamificationContext = createContext();

export function useGamification() {
    return useContext(GamificationContext);
}

export function GamificationProvider({ children }) {
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('student_xp') || '0'));
    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('student_streak') || '1'));
    const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('student_badges') || '[]'));

    // Derived state
    const level = Math.floor(xp / 100) + 1;
    const nextLevelXp = level * 100;
    const progressToNextLevel = ((xp % 100) / 100) * 100;

    useEffect(() => {
        localStorage.setItem('student_xp', xp.toString());
        localStorage.setItem('student_streak', streak.toString());
        localStorage.setItem('student_badges', JSON.stringify(badges));
    }, [xp, streak, badges]);

    const addXp = (amount) => {
        const oldLevel = Math.floor(xp / 100) + 1;
        const newXp = xp + amount;
        setXp(newXp);

        const newLevel = Math.floor(newXp / 100) + 1;

        if (newLevel > oldLevel) {
            triggerLevelUp(newLevel);
        }
    };

    const triggerLevelUp = (newLevel) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2D68C4', '#D4AF37', '#ffffff']
        });

        // You could add a toast notification here later
        console.log(`Level Up! You are now level ${newLevel}`);
    };

    const awardBadge = (badgeId) => {
        if (!badges.includes(badgeId)) {
            setBadges([...badges, badgeId]);
            confetti({
                particleCount: 50,
                spread: 45,
                origin: { y: 0.5 }
            });
        }
    };

    const value = {
        xp,
        level,
        streak,
        badges,
        nextLevelXp,
        progressToNextLevel,
        addXp,
        awardBadge
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
}
