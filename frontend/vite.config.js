import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/api': 'http://127.0.0.1:8000',
            '/quiz': 'http://127.0.0.1:8000',
            '/dashboard': 'http://127.0.0.1:8000',
            '/streams': 'http://127.0.0.1:8000',
            '/exams': 'http://127.0.0.1:8000',
            '/subjects': 'http://127.0.0.1:8000',
            '/quiz-types': 'http://127.0.0.1:8000',
            '/exam': 'http://127.0.0.1:8000',
            '/chat': 'http://127.0.0.1:8000',
        }
    }
})
