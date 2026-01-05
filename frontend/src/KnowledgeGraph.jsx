import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { getDashboardStats } from './api';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { PageLoader } from './components/LoadingSpinner';

export default function KnowledgeGraph() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats(1)
            .then(res => {
                setNodes(res.data.knowledge_graph);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <PageLoader message="Building your Knowledge Graph..." />;
    }

    // Calculate node positions in a circular layout
    const getNodePosition = (index, total) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
        const radius = 35; // percentage
        const centerX = 50;
        const centerY = 50;
        
        return {
            left: `${centerX + radius * Math.cos(angle)}%`,
            top: `${centerY + radius * Math.sin(angle)}%`,
        };
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <Navbar />
            <div className="relative h-[calc(100vh-64px)] w-full p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 mb-8"
                >
                    <div className="glass-card px-6 py-4 rounded-2xl border inline-flex items-center gap-3">
                        <Brain className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">Knowledge Graph</h1>
                            <p className="text-xs text-muted-foreground">Real-time topic mastery visualization</p>
                        </div>
                    </div>
                </motion.div>

                {/* Graph Container */}
                <div className="relative h-[calc(100%-100px)] w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full max-w-5xl aspect-square">
                            {/* Center Node */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                                <div className="glass-card p-8 rounded-3xl border-2 border-primary/50 shadow-glow">
                                    <Brain className="h-16 w-16 text-primary mx-auto mb-3 animate-float" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">Your Brain</div>
                                        <div className="text-sm text-muted-foreground">Learning Network</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                                {nodes.map((_, i) => {
                                    const pos = getNodePosition(i, nodes.length);
                                    // Convert percentage to pixels for SVG
                                    const x1 = "50%";
                                    const y1 = "50%";
                                    const x2 = pos.left;
                                    const y2 = pos.top;
                                    
                                    return (
                                        <motion.line
                                            key={i}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="rgba(45, 104, 196, 0.3)"
                                            strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: i * 0.1, duration: 0.5 }}
                                        />
                                    );
                                })}
                            </svg>

                            {/* Topic Nodes */}
                            {nodes.map((node, i) => {
                                const position = getNodePosition(i, nodes.length);
                                const size = 60 + (node.strength * 80);
                                const strengthPercent = Math.round(node.strength * 100);
                                
                                let colorClass = 'from-error/30 to-error/10 border-error/50 text-error';
                                let icon = Target;
                                
                                if (node.strength >= 0.7) {
                                    colorClass = 'from-success/30 to-success/10 border-success/50 text-success';
                                    icon = TrendingUp;
                                } else if (node.strength >= 0.4) {
                                    colorClass = 'from-warning/30 to-warning/10 border-warning/50 text-warning';
                                    icon = Zap;
                                }
                                
                                const Icon = icon;

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ 
                                            delay: 0.5 + i * 0.1, 
                                            type: "spring",
                                            stiffness: 200 
                                        }}
                                        whileHover={{ scale: 1.15, zIndex: 30 }}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                        style={{
                                            ...position,
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            zIndex: 10,
                                        }}
                                    >
                                        <div className={`
                                            w-full h-full rounded-full
                                            flex flex-col items-center justify-center
                                            glass-card border-2 backdrop-blur-xl
                                            bg-gradient-to-br ${colorClass}
                                            shadow-glow transition-all duration-300
                                            hover:shadow-glow-lg
                                        `}>
                                            <Icon className="h-6 w-6 mb-1" />
                                            <div className="text-center px-2">
                                                <div className="font-bold text-sm leading-tight mb-1">
                                                    {node.topic}
                                                </div>
                                                <div className="text-xs font-mono font-bold">
                                                    {strengthPercent}%
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Empty State */}
                            {nodes.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="text-center glass-card p-12 rounded-3xl border">
                                        <Brain className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold mb-3">No Data Yet</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Start taking quizzes to build your knowledge graph
                                        </p>
                                        <a
                                            href="/quiz"
                                            className="inline-flex px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg font-semibold hover:shadow-glow transition-all"
                                        >
                                            Start Quiz Now
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    {nodes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute bottom-8 right-8 glass-card p-4 rounded-xl border"
                        >
                            <div className="text-sm font-semibold mb-3">Mastery Levels</div>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-success/30 border border-success"></div>
                                    <span>Expert (70%+)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-warning/30 border border-warning"></div>
                                    <span>Intermediate (40-69%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-error/30 border border-error"></div>
                                    <span>Needs Work (&lt;40%)</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}