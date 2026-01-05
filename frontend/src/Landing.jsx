import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/Button';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, TrendingUp, Shield, Sparkles } from 'lucide-react';

export default function Landing() {
    const features = [
        {
            icon: Brain,
            title: "Dynamic Knowledge Graph",
            desc: "Real-time visualization of your topic mastery with intelligent tracking",
            gradient: "from-primary to-accent"
        },
        {
            icon: Target,
            title: "Predictive AI Engine",
            desc: "Advanced algorithms predict weak areas before you fail",
            gradient: "from-accent to-secondary"
        },
        {
            icon: Zap,
            title: "Adaptive Difficulty",
            desc: "Questions automatically adjust to your skill level in real-time",
            gradient: "from-secondary to-primary"
        }
    ];

    const stats = [
        { value: "95%", label: "Accuracy Rate", icon: Target },
        { value: "10x", label: "Faster Learning", icon: TrendingUp },
        { value: "AI-Powered", label: "Intelligence", icon: Brain },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl w-full space-y-16"
                >
                    {/* Hero Section */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border text-sm mb-4"
                        >
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">Powered by Advanced AI</span>
                        </motion.div>

                        <h1 className="text-7xl md:text-8xl font-black tracking-tighter">
                            <span className="gradient-text text-glow">
                                Adaptive Exam AI
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                            The <span className="text-primary font-semibold">intelligent learning platform</span> that evolves with you.
                            <br />
                            Powered by <span className="text-accent font-semibold">Behavioral Analysis</span> & <span className="text-secondary-light font-semibold">Knowledge Graphs</span>.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <Link to="/dashboard">
                                <Button 
                                    size="lg" 
                                    className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:shadow-glow-lg transition-all duration-300 glow"
                                >
                                    Start Learning Now
                                    <Sparkles className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/quiz">
                                <Button 
                                    size="lg" 
                                    variant="outline"
                                    className="text-lg px-10 py-7 glass-card hover:bg-white/10 transition-all"
                                >
                                    Try Demo Quiz
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8"
                    >
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="glass-card p-6 rounded-2xl border backdrop-blur-xl"
                                >
                                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                                    <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-wide">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                                    whileHover={{ scale: 1.05, y: -10 }}
                                    className="group glass-card p-8 rounded-2xl border hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:shadow-glow transition-shadow`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="glass-card p-12 rounded-3xl border border-primary/20 backdrop-blur-xl mt-16"
                    >
                        <Shield className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to <span className="gradient-text">Transform</span> Your Learning?
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of students who are learning smarter, not harder, with AI-powered adaptive technology.
                        </p>
                        <Link to="/dashboard">
                            <Button 
                                size="lg" 
                                className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-glow-lg glow"
                            >
                                Get Started Free
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
