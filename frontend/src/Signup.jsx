import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from './api';
import { Button } from './components/Button';
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle, RefreshCw, ArrowLeft, Globe } from 'lucide-react';
import { auth, signInWithGoogle } from './firebase'; // Import Google Auth
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

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
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-xl overflow-hidden relative z-10">
                <div className="p-6 bg-secondary/20 border-b border-border text-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {step === 1 ? "Create Account" : step === 2 ? "Verify Email" : "Setup Profile"}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {step === 1 ? "Join the elite learning platform." :
                            step === 2 ? "We sent a verification link to your email." :
                                "Choose your unique username."}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center gap-3 text-red-500 text-sm animate-shake">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Step 1: Firebase Signup */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <form onSubmit={handleFirebaseSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-secondary/50 border border-input rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="student@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            className="w-full bg-secondary/50 border border-input rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                                            placeholder="Minimum 6 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creating Account..." : "Continue"} <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </form>

                            <div className="relative">
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
                                onClick={handleGoogleSignup}
                                disabled={loading}
                                className="w-full"
                            >
                                <Globe size={18} className="mr-2" /> Google
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Verification Wait */}
                    {step === 2 && (
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                                <Mail className="text-primary" size={32} />
                            </div>

                            <div className="space-y-2">
                                <p className="text-foreground">Please check <strong>{email}</strong></p>
                                <p className="text-muted-foreground text-sm">
                                    Click the link in the email we just sent you. This window will update automatically once verified.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <Button variant="outline" onClick={handleResend} disabled={loading} className="w-full">
                                    <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Resend Link
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Backend Profile */}
                    {step === 3 && (
                        <form onSubmit={handleCompleteSignup} className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded mb-4 text-green-500 text-sm">
                                <CheckCircle size={16} />
                                <span>{password ? "Email Verified Successfully!" : "Authenticated via Google"}</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold ml-1">Choose Username</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-secondary/50 border border-input rounded-md py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/50"
                                        placeholder="unique_username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Profile..." : "Create Profile"} <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>
                    )}
                </div>

                <div className="p-4 bg-secondary/10 border-t border-border flex justify-between items-center text-sm">
                    <Link to="/" className="text-muted-foreground hover:text-primary flex items-center">
                        <ArrowLeft size={16} className="mr-1" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
