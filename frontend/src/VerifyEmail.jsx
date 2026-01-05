import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail } from './api';
import { Button } from './components/Button';
import { ArrowRight, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await verifyEmail({ email, code });
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Verification failed. Check the code.");
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-error">
                Error: No email provided. Please sign up first.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-8 rounded-2xl border border-primary/20 shadow-glow text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        {success ? (
                            <CheckCircle className="h-8 w-8 text-success" />
                        ) : (
                            <Mail className="h-8 w-8 text-primary" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                    <p className="text-muted-foreground mb-6">
                        We sent a specific code to <span className="text-foreground font-mono">{email}</span>.
                        <br />(Check the server console for the code in Demo Mode)
                    </p>

                    {success ? (
                        <div className="text-success font-bold text-lg animate-pulse">
                            Verification Successful! Redirecting...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-error/10 border border-error/50 text-error text-sm">
                                    {error}
                                </div>
                            )}

                            <input
                                type="text"
                                maxLength="6"
                                required
                                className="w-full bg-secondary/50 border border-input rounded-lg py-3 text-center text-2xl font-mono tracking-widest text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                placeholder="000000"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                            />

                            <Button
                                type="submit"
                                disabled={loading || code.length < 6}
                                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-glow font-bold py-3"
                            >
                                {loading ? "Verifying..." : "Verify Code"}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
