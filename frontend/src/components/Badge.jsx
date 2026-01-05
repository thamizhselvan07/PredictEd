import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
    const variants = {
        default: 'bg-primary/20 text-primary border-primary/30',
        success: 'bg-success/20 text-success border-success/30',
        warning: 'bg-warning/20 text-warning border-warning/30',
        error: 'bg-error/20 text-error border-error/30',
        info: 'bg-info/20 text-info border-info/30',
        secondary: 'bg-secondary/20 text-secondary-light border-secondary/30',
        accent: 'bg-accent/20 text-accent-light border-accent/30',
    };
    
    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    };
    
    return (
        <span
            className={`
                inline-flex items-center justify-center
                rounded-full border backdrop-blur-sm
                font-semibold whitespace-nowrap
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {children}
        </span>
    );
}

export function RiskBadge({ level, className = '' }) {
    const variants = {
        CRITICAL: { variant: 'error', label: '🔴 CRITICAL' },
        HIGH: { variant: 'warning', label: '🟠 HIGH' },
        MODERATE: { variant: 'info', label: '🟡 MODERATE' },
        LOW: { variant: 'success', label: '🟢 LOW' },
    };
    
    const config = variants[level] || variants.MODERATE;
    
    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}

export function DifficultyBadge({ difficulty, className = '' }) {
    const percentage = difficulty * 100;
    
    let variant = 'success';
    let label = 'Easy';
    
    if (percentage >= 70) {
        variant = 'error';
        label = 'Hard';
    } else if (percentage >= 40) {
        variant = 'warning';
        label = 'Medium';
    }
    
    return (
        <Badge variant={variant} className={className}>
            {label} ({Math.round(percentage)}%)
        </Badge>
    );
}