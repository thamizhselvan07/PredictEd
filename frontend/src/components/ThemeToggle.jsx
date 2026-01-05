import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
            ) : (
                <Moon className="h-5 w-5 text-slate-700 hover:text-slate-900 transition-colors" />
            )}
        </button>
    );
}
