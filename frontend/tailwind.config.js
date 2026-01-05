/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505", // Deep charcoal / near-black
                foreground: "#F3F4F6",

                primary: {
                    DEFAULT: "#00F0FF", // Electric Blue / Cyan
                    foreground: "#000000",
                    light: "#5CFFFF",
                    dark: "#00B8CC",
                },
                secondary: {
                    DEFAULT: "#A855F7", // Violet / purple
                    foreground: "#FFFFFF",
                    light: "#C084FC",
                    dark: "#7E22CE",
                },
                accent: {
                    DEFAULT: "#22D3EE", // Cyan accent
                    foreground: "#000000",
                    light: "#67E8F9",
                    dark: "#0891B2",
                },

                card: {
                    DEFAULT: "rgba(20, 20, 20, 0.7)",
                    foreground: "#E5E7EB",
                },

                muted: {
                    DEFAULT: "#18181B", // Zinc-900
                    foreground: "#9CA3AF",
                },

                border: "rgba(255, 255, 255, 0.1)",
                input: "#18181B",
                ring: "#00F0FF",

                success: "#34D399", // Soft Green
                warning: "#F59E0B",
                error: "#F87171", // Soft Red
                info: "#38BDF8",
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
                'glass': '0 8px 32px 0 rgba(0, 240, 255, 0.1)',
                'glow': '0 0 20px rgba(0, 240, 255, 0.3)',
                'glow-lg': '0 0 40px rgba(0, 240, 255, 0.5)',
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