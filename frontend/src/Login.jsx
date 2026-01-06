import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './api';
import { Button } from './components/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/Card';
import { Lock, Mail, ArrowRight, AlertCircle, BrainCircuit } from 'lucide-react';
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
            } else {
                setError(err.response?.data?.detail || "Invalid credentials");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
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
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] animate-pulse-slow opacity-30" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] animate-float opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="glass-card border-primary/20 shadow-glow-lg backdrop-blur-2xl">
                    <CardHeader className="space-y-4 text-center pb-8 border-b border-white/5">
                        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-glow mb-4">
                            <div className="w-full h-full bg-background/90 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                                <img src={Logo} alt="PredictEd" className="h-12 w-12 object-contain mix-blend-screen" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary pb-1 block">
                                Welcome Back
                            </CardTitle>
                            <p className="text-muted-foreground mt-2 text-sm">
                                Authenticate to access your neural dashboard
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-3 rounded-lg bg-error/10 border border-error/50 text-error text-sm flex items-center gap-2"
                                >
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Username</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-11 pl-10 bg-black/20 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="Enter your username"
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full h-11 pl-10 bg-black/20 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 text-lg shadow-glow hover:shadow-glow-lg transition-all"
                            >
                                {loading ? "Authenticating..." : "Initialize Session"}
                                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground rounded-full border border-white/10">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-12 bg-white text-black hover:bg-gray-100 font-bold rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google Account
                        </button>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            No credentials found?{' '}
                            <Link to="/signup" className="text-primary hover:text-primary-light hover:underline font-bold transition-colors">
                                Create New Profile
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground/50 mt-6">
                    Protected by Quantum-Resistant Encryption. Unauthorized access is prohibited.
                </p>
            </motion.div>
        </div>
    );
}
