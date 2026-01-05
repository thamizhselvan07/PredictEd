/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0A0E1A",
                foreground: "#E5E7EB",
                
                primary: {
                    DEFAULT: "#2D68C4",
                    foreground: "#FFFFFF",
                    light: "#4A7FD6",
                    dark: "#1E4A8F",
                },
                secondary: {
                    DEFAULT: "#004953",
                    foreground: "#FFFFFF",
                    light: "#006B7D",
                    dark: "#002F37",
                },
                accent: {
                    DEFAULT: "#0000B8",
                    foreground: "#FFFFFF",
                    light: "#2929E6",
                    dark: "#000085",
                },
                
                card: {
                    DEFAULT: "rgba(17, 24, 39, 0.7)",
                    foreground: "#E5E7EB",
                },
                
                muted: {
                    DEFAULT: "#1F2937",
                    foreground: "#9CA3AF",
                },
                
                border: "rgba(55, 65, 81, 0.5)",
                input: "#1F2937",
                ring: "#2D68C4",
                
                success: "#10B981",
                warning: "#F59E0B",
                error: "#EF4444",
                info: "#3B82F6",
            },
            
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
            
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            
            backdropBlur: {
                xs: '2px',
            },
            
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glow': '0 0 20px rgba(45, 104, 196, 0.5)',
                'glow-lg': '0 0 40px rgba(45, 104, 196, 0.6)',
            },
            
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
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
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}