import React from 'react';
import { Loader2, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md', message = 'Loading...', variant = 'default' }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };
    
    if (variant === 'brain') {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="text-primary"
                >
                    <Brain className={sizes[size]} />
                </motion.div>
                {message && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
            {message && (
                <p className="text-sm text-muted-foreground animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
}

export function PageLoader({ message = 'AI is processing...' }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <LoadingSpinner size="xl" message={message} variant="brain" />
        </div>
    );
}