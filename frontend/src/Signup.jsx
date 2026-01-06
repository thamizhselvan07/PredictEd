import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from './api';
import { Button } from './components/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/Card';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle, RefreshCw, ArrowLeft, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, signInWithGoogle } from './firebase'; // Import Google Auth
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Logo from './assets/logo.png';

export default function Signup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: SignUp -> 2: Verification -> 3: Profile
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    // Polling for Email Verification
    useEffect(() => {
        let interval;
        if (step === 2 && firebaseUser && !isVerified) {
            interval = setInterval(async () => {
                await firebaseUser.reload();
                if (firebaseUser.emailVerified) {
                    setIsVerified(true);
                    setStep(3); // Proceed to Profile Creation
                    clearInterval(interval);
                }
            }, 3000); // Check every 3 seconds
        }
        return () => clearInterval(interval);
    }, [step, firebaseUser, isVerified]);

    // Step 1: Create Firebase Account & Send Verification
    const handleFirebaseSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await sendEmailVerification(user);
            setFirebaseUser(user);
            setStep(2); // Go to Verification UI
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already registered. Please login.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError("Failed to create account. " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In
    const handleGoogleSignup = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithGoogle();
            const user = result.user;
            setFirebaseUser(user);
            setEmail(user.email);
            setIsVerified(true); // Google users are auto-verified
            setPassword(''); // No password for Google users
            setStep(3); // Skip verification, go to Profile
        } catch (err) {
            console.error(err);
            setError("Google Sign-In failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Resend Verification Email
    const handleResend = async () => {
        if (firebaseUser) {
            setLoading(true);
            try {
                await sendEmailVerification(firebaseUser);
                alert("Verification email resent!");
            } catch (err) {
                setError("Failed to resend email: " + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    // Step 3: Create Backend Profile
    const handleCompleteSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signup({
                username,
                email,
                password: password || null // Send null if empty (Google Auth)
            });
            navigate('/', { state: { message: "Account created! Please login." } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to create profile.");
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
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 shadow-glow mb-2">
                            <div className="w-full h-full bg-background/90 rounded-2xl flex items-center justify-center backdrop-blur-xl">
                                <img src={Logo} alt="PredictEd" className="h-10 w-10 object-contain mix-blend-screen" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary pb-1 block">
                                {step === 1 ? "Start Your Journey" : step === 2 ? "Verify Identity" : "Finalize Profile"}
                            </CardTitle>
                            <p className="text-muted-foreground mt-2 text-xs uppercase tracking-wider">
                                {step === 1 ? "Join the elite learning platform" :
                                    step === 2 ? "Security Check Required" :
                                        "Claim your unique handle"}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-6">
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

                        <AnimatePresence mode="wait">
                            {/* Step 1: Firebase Signup */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <form onSubmit={handleFirebaseSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full h-11 pl-10 bg-black/20 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                                                    placeholder="student@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Set Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    className="w-full h-11 pl-10 bg-black/20 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                                                    placeholder="Minimum 6 characters"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 text-lg shadow-glow hover:shadow-glow-lg transition-all"
                                        >
                                            {loading ? "Initializing..." : "Create Account"}
                                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                                        </Button>
                                    </form>

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground rounded-full border border-white/10">Or continue with</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleGoogleSignup}
                                        disabled={loading}
                                        className="w-full h-12 bg-white text-black hover:bg-gray-100 font-bold rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                                    >
                                        <Globe className="h-5 w-5" />
                                        Google Account
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Verification Wait */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-4"
                                >
                                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
                                        <Mail className="text-primary h-10 w-10 relative z-10" />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-foreground text-lg font-medium">Verification Link Sent</p>
                                        <p className="text-muted-foreground text-sm">
                                            We sent a distinct quantum link to <br /><span className="text-primary font-mono">{email}</span>
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs text-muted-foreground">
                                        <p className="mb-2">Click the link in your email to proceed.</p>
                                        <p>This window will update automatically once verified.</p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={handleResend}
                                        disabled={loading}
                                        className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Resend Verification
                                    </Button>
                                </motion.div>
                            )}

                            {/* Step 3: Backend Profile */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm font-medium">
                                        <CheckCircle size={20} className="shrink-0" />
                                        <span>{password ? "Identity Verified Successfully" : "Authenticated via Google Secure Auth"}</span>
                                    </div>

                                    <form onSubmit={handleCompleteSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Choose Username</label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-11 pl-10 bg-black/20 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                                                    placeholder="unique_handle"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground ml-1">This will be your display name on the leaderboard.</p>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 text-lg shadow-glow hover:shadow-glow-lg transition-all"
                                        >
                                            {loading ? "Finalizing..." : "Complete Setup"}
                                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <div className="p-4 border-t border-white/5 bg-black/20 flex justify-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-primary flex items-center transition-colors font-medium">
                            <ArrowLeft size={16} className="mr-2" /> Back to Login
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
