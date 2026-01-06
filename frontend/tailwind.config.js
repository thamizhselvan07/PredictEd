/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",

                primary: {
                    DEFAULT: "rgb(var(--primary) / <alpha-value>)",
                    foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
                    light: "#67E8F9", // Cyan 300
                    dark: "#0E7490",  // Cyan 700
                },
                secondary: {
                    DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
                    foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
                    light: "#A78BFA", // Violet 400
                    dark: "#7C3AED",  // Violet 600
                },
                accent: {
                    DEFAULT: "rgb(var(--accent) / <alpha-value>)",
                    foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "rgb(var(--card) / <alpha-value>)",
                    foreground: "rgb(var(--card-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "rgb(var(--muted) / <alpha-value>)",
                    foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
                },
                border: "rgb(var(--border) / <alpha-value>)",
                input: "rgb(var(--input) / <alpha-value>)",
                ring: "rgb(var(--ring) / <alpha-value>)",

                success: "#10B981", // Emerald 500
                warning: "#F59E0B", // Amber 500
                error: "#EF4444",   // Red 500
                info: "#3B82F6",    // Blue 500
            },

            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
                brand: ['Orbitron', 'sans-serif'],
            },

            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'neon-gradient': 'linear-gradient(to right, #00f2ea, #ff0050)',
            },

            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
                'glow': '0 0 15px rgba(6, 182, 212, 0.5)', // Cyan glow
                'glow-lg': '0 0 30px rgba(6, 182, 212, 0.6)',
                'glow-error': '0 0 15px rgba(239, 68, 68, 0.5)',
                'glow-success': '0 0 15px rgba(16, 185, 129, 0.5)',
                'neon': '0 0 5px theme("colors.primary.DEFAULT"), 0 0 20px theme("colors.primary.DEFAULT")',
            },

            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 2s infinite',
                'spin-slow': 'spin 3s linear infinite',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)' },
                },
            },
        },
    },
    plugins: [],
}