import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './api';
import { Button } from './components/Button';
import { Card, CardContent } from './components/Card';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './assets/logo.png';

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
                    <div className="flex flex-col items-center justify-center gap-4 mb-4">
                        <img src={Logo} alt="Logo" className="w-24 h-24 object-contain drop-shadow-glow animate-float mix-blend-screen" />
                        <h1 className="text-5xl font-bold font-brand bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            PredictEd
                        </h1>
                    </div>
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

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                            setLoading(true);
                            setError(null);
                            try {
                                const { signInWithGoogle } = await import('./firebase');
                                const result = await signInWithGoogle();
                                const email = result.user.email;

                                const { googleLogin } = await import('./api');
                                const res = await googleLogin({ email });

                                localStorage.setItem('user', JSON.stringify(res.data));
                                navigate('/streams');
                            } catch (err) {
                                console.error(err);
                                if (err.response?.status === 404) {
                                    setError("Account not found. Please Sign Up first.");
                                } else {
                                    setError("Google Login failed: " + err.message);
                                }
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

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
