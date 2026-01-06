import React from 'react';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function Card({ className, children, ...props }) {
    return (
        <div className={cn("glass-card text-card-foreground shadow-sm hover:shadow-glow hover:border-primary/30 transition-all duration-300", className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
    return <h3 className={cn("text-xl font-bold font-brand tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }) {
    return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>;
}
