import React from 'react';

export function Button({ className, variant = "default", size = "default", children, ...props }) {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    const variants = {
        default: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow hover:translate-y-[-2px] border border-transparent",
        destructive: "bg-error/20 text-error border border-error/50 hover:bg-error/30 hover:shadow-glow-error",
        outline: "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent/10 hover:text-accent hover:border-accent/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-glow",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent",
        glow: "bg-primary/20 text-primary border border-primary/50 shadow-glow hover:bg-primary/30 hover:shadow-glow-lg",
    };

    const sizes = {
        default: "h-11 px-6 py-2", // SLIGHTLY LARGER
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
