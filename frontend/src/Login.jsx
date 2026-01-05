import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './api';
import { Button } from './components/Button';
import { Card, CardContent } from './components/Card';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await login(formData);
            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/streams');
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError("Email not verified. Please verify your email.");
                // Optionally redirect to verify page if we tracked their email
            } else {
                setError(err.response?.data?.detail || "Invalid credentials");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                        Adaptive Exam AI
                    </h1>
                    <p className="text-muted-foreground">Sign in to continue your journey</p>
                </div>

                <div className="glass-card p-8 rounded-2xl border border-primary/20 shadow-glow">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-error/10 border border-error/50 text-error text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-secondary/50 border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-secondary/50 border border-input rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow text-primary-foreground font-bold py-3"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            Create Account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
