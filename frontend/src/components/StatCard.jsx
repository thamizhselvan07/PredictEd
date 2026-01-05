import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue,
    variant = 'default',
    className = '' 
}) {
    const variants = {
        default: 'from-primary/10 to-primary/5 border-primary/20',
        success: 'from-success/10 to-success/5 border-success/20',
        warning: 'from-warning/10 to-warning/5 border-warning/20',
        error: 'from-error/10 to-error/5 border-error/20',
        info: 'from-info/10 to-info/5 border-info/20',
    };
    
    const valueColors = {
        default: 'text-primary',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
        info: 'text-info',
    };
    
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
            className={`
                stat-card
                glass-card p-6 rounded-xl border
                bg-gradient-to-br ${variants[variant]}
                ${className}
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {title}
                    </p>
                </div>
                {Icon && (
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${variants[variant]}`}>
                        <Icon className={`h-5 w-5 ${valueColors[variant]}`} />
                    </div>
                )}
            </div>
            
            <div className="flex items-baseline gap-2">
                <h3 className={`text-3xl font-bold ${valueColors[variant]}`}>
                    {value}
                </h3>
                {trend && trendValue && (
                    <div className={`flex items-center text-sm font-medium ${
                        trend === 'up' ? 'text-success' : 'text-error'
                    }`}>
                        {trend === 'up' ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="ml-1">{trendValue}%</span>
                    </div>
                )}
            </div>
            
            {subtitle && (
                <p className="text-xs text-muted-foreground mt-2">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}