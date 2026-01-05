import React from 'react';
import { motion } from 'framer-motion';

export function ProgressBar({ value, max = 100, className = '', showLabel = true, variant = 'default' }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const variantClasses = {
        default: 'from-primary to-accent',
        success: 'from-green-500 to-emerald-500',
        warning: 'from-yellow-500 to-orange-500',
        error: 'from-red-500 to-rose-500',
    };
    
    const gradientClass = variantClasses[variant] || variantClasses.default;
    
    return (
        <div className={`w-full ${className}`}>
            <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradientClass} rounded-full shadow-glow`}
                />
                {showLabel && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white drop-shadow-lg">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function CircularProgress({ value, max = 100, size = 120, strokeWidth = 8 }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-muted/30"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2D68C4" />
                        <stop offset="100%" stopColor="#0000B8" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
}