import React, { useEffect, useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import { getDashboardStats } from './api';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Activity, BarChart3, PieChart as PieIcon, TrendingUp, Layers, Target } from 'lucide-react';
import { PageLoader } from './components/LoadingSpinner';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Legend, LineChart, Line
} from 'recharts';

export default function KnowledgeGraph() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredNode, setHoveredNode] = useState(null);

    useEffect(() => {
        getDashboardStats(1) // Assuming user_id=1
            .then(res => {
                setNodes(res.data.knowledge_graph || []);
                setLoading(false);
            })
            .catch(() => {
                setNodes([]);
                setLoading(false);
            });
    }, []);

    // --- Structured Layout Calculation ---
    const layout = useMemo(() => {
        if (!nodes.length) return { center: { x: 50, y: 50 }, subjects: [], links: [] };

        // 1. Group by Subject
        const subjects = {};
        nodes.forEach(node => {
            if (!subjects[node.subject]) subjects[node.subject] = [];
            subjects[node.subject].push(node);
        });

        const subjectKeys = Object.keys(subjects);
        const totalSubjects = subjectKeys.length;
        const centerX = 50; // Percentage
        const centerY = 50; // Percentage

        // Radii
        const subjectRadius = 25; // Distance from center to subject hub
        const topicRadius = 15;   // Distance from subject hub to topic node

        const processedSubjects = [];
        const processedLinks = [];

        subjectKeys.forEach((subject, i) => {
            // Calculate Subject Hub Position
            const angle = (i / totalSubjects) * 2 * Math.PI - Math.PI / 2;
            const sx = centerX + subjectRadius * Math.cos(angle);
            const sy = centerY + subjectRadius * Math.sin(angle);

            // Link Center -> Subject
            processedLinks.push({
                id: `link-center-${subject}`,
                x1: centerX, y1: centerY,
                x2: sx, y2: sy,
                type: 'primary'
            });

            // Process Topics for this Subject
            const topics = subjects[subject];
            const processedTopics = topics.map((topic, j) => {
                // Fan topics outwards from the subject hub
                // Fan angle spread needs to be limited to avoid overlap with neighbor subjects
                const spreadAngle = Math.PI / 2; // 90 degrees total spread per subject
                const startAngle = angle - spreadAngle / 2;
                const fanStep = topics.length > 1 ? spreadAngle / (topics.length - 1) : 0;

                const topicAngle = topics.length === 1 ? angle : startAngle + (j * fanStep);

                const tx = sx + topicRadius * Math.cos(topicAngle);
                const ty = sy + topicRadius * Math.sin(topicAngle);

                // Link Subject -> Topic
                processedLinks.push({
                    id: `link-${subject}-${topic.topic}`,
                    x1: sx, y1: sy,
                    x2: tx, y2: ty,
                    type: 'secondary',
                    subject: subject
                });

                return {
                    ...topic,
                    x: tx,
                    y: ty,
                    type: 'topic'
                };
            });

            processedSubjects.push({
                name: subject,
                x: sx,
                y: sy,
                topics: processedTopics,
                count: topics.length,
                avgStrength: topics.reduce((acc, t) => acc + t.strength, 0) / topics.length
            });
        });

        return { center: { x: centerX, y: centerY }, subjects: processedSubjects, links: processedLinks };
    }, [nodes]);


    // --- Analytics Data Check ---
    const barData = useMemo(() => {
        return nodes.map(node => ({
            name: node.topic,
            strength: Math.round(node.strength * 100),
            raw: node.strength
        })).sort((a, b) => b.strength - a.strength).slice(0, 10);
    }, [nodes]);

    const pieData = useMemo(() => {
        const stats = { Strong: 0, Medium: 0, Weak: 0 };
        nodes.forEach(n => {
            if (n.strength >= 0.7) stats.Strong++;
            else if (n.strength >= 0.4) stats.Medium++;
            else stats.Weak++;
        });
        return [
            { name: 'Strong', value: stats.Strong, color: '#10b981' },
            { name: 'Medium', value: stats.Medium, color: '#f59e0b' },
            { name: 'Weak', value: stats.Weak, color: '#ef4444' }
        ].filter(d => d.value > 0);
    }, [nodes]);

    const lineData = useMemo(() => {
        if (!nodes.length) return [];
        const top = nodes.slice(0, 3);
        const data = [];
        for (let i = 0; i <= 5; i++) {
            const p = { attempt: `Pt ${i}` };
            top.forEach(t => {
                const s = Math.round(t.strength * 100);
                p[t.topic] = Math.min(100, Math.round(s * (0.2 + 0.8 * (i / 5)) + (Math.random() * 10 - 5)));
            });
            data.push(p);
        }
        return data;
    }, [nodes]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 !bg-black/90 border border-white/10 rounded-lg shadow-xl text-xs">
                    <p className="font-bold text-white mb-1">{label}</p>
                    {payload.map((e, i) => (
                        <p key={i} style={{ color: e.color || e.stroke || e.fill }}>
                            {e.name}: {e.value}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };


    if (loading) return <PageLoader message="Organizing Knowledge Structure..." />;

    return (
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden text-foreground">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-flex items-center gap-2">
                            <Layers className="h-8 w-8 text-primary" /> Mind Map
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Structured visualization of your mastery across subjects.
                        </p>
                    </div>
                </div>

                {/* 1. VISUALIZATION CONTAINER */}
                <section className="relative w-full aspect-square md:aspect-[16/9] max-h-[600px] glass-card rounded-3xl border border-primary/20 overflow-hidden shadow-2xl bg-black/40">

                    {/* Overlay Stats */}
                    <div className="absolute top-6 left-6 z-20 space-y-2 pointer-events-none">
                        <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Topics</div>
                            <div className="text-2xl font-bold text-white">{nodes.length}</div>
                        </div>
                        <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Subjects</div>
                            <div className="text-xl font-bold text-primary">{layout.subjects.length}</div>
                        </div>
                    </div>

                    {nodes.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <Activity className="h-12 w-12 text-muted mb-4 opacity-50" />
                            <p className="text-muted-foreground">Start taking quizzes to populate your map.</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full">

                            {/* SVG Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {layout.links.map(link => (
                                    <motion.line
                                        key={link.id}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: link.type === 'primary' ? 0.3 : 0.15 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        x1={`${link.x1}%`} y1={`${link.y1}%`}
                                        x2={`${link.x2}%`} y2={`${link.y2}%`}
                                        stroke={link.type === 'primary' ? '#00f0ff' : 'currentColor'}
                                        strokeWidth={link.type === 'primary' ? 2 : 1}
                                        className={link.type === 'primary' ? 'text-primary' : 'text-muted-foreground'}
                                    />
                                ))}
                            </svg>

                            {/* Center Node (Brain) */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                            >
                                <div className="w-20 h-20 rounded-full glass-card border-2 border-primary shadow-[0_0_40px_rgba(0,240,255,0.3)] flex items-center justify-center bg-black/50 backdrop-blur-xl">
                                    <Brain className="h-10 w-10 text-primary animate-pulse" />
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs font-bold text-primary tracking-widest uppercase">
                                    My Brain
                                </div>
                            </motion.div>

                            {/* Subject Hub Nodes */}
                            {layout.subjects.map((subject, i) => (
                                <motion.div
                                    key={`subject-${subject.name}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                                    style={{ left: `${subject.x}%`, top: `${subject.y}%` }}
                                >
                                    <div className="w-12 h-12 rounded-full border border-white/20 bg-card/80 backdrop-blur shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                                        <Layers className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-[10px] font-bold text-foreground bg-black/50 px-2 py-0.5 rounded-full border border-white/5 whitespace-nowrap">
                                        {subject.name}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Topic Nodes */}
                            {layout.subjects.flatMap(s => s.topics).map((topic, i) => {
                                const color = topic.strength >= 0.7 ? 'bg-emerald-500' : topic.strength >= 0.4 ? 'bg-amber-500' : 'bg-red-500';
                                const ringColor = topic.strength >= 0.7 ? 'border-emerald-500/30' : topic.strength >= 0.4 ? 'border-amber-500/30' : 'border-red-500/30';

                                return (
                                    <motion.div
                                        key={`topic-${topic.topic}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8 + (i * 0.05) }}
                                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                                        style={{ left: `${topic.x}%`, top: `${topic.y}%` }}
                                        onMouseEnter={() => setHoveredNode(topic)}
                                        onMouseLeave={() => setHoveredNode(null)}
                                    >
                                        <div className={`
                                            w-4 h-4 rounded-full ${color} shadow-lg cursor-pointer
                                            ring-4 ${ringColor} transition-all duration-300
                                            hover:scale-150 hover:ring-2
                                        `}></div>

                                        {/* Hover Label */}
                                        <AnimatePresence>
                                            {hoveredNode?.topic === topic.topic && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/90 border border-white/20 px-3 py-2 rounded-lg shadow-xl z-50 min-w-[120px]"
                                                >
                                                    <div className="text-xs font-bold text-white whitespace-nowrap">{topic.topic}</div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5 flex justify-between items-center">
                                                        <span>Mastery</span>
                                                        <span className={
                                                            topic.strength >= 0.7 ? 'text-emerald-400' :
                                                                topic.strength >= 0.4 ? 'text-amber-400' : 'text-red-400'
                                                        }>{Math.round(topic.strength * 100)}%</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}

                        </div>
                    )}
                </section>

                {/* ANALYTICS SECTION (Preserved) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-border/50">

                    {/* Bar Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-accent" /> Topic Leaders
                            </h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: '#888' }} stroke="transparent" />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="strength" radius={[0, 4, 4, 0]} barSize={15}>
                                        {barData.map((e, i) => (
                                            <Cell key={i} fill={e.raw >= 0.7 ? '#10b981' : e.raw >= 0.4 ? '#f59e0b' : '#ef4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <PieIcon className="h-5 w-5 text-accent" /> Mastery Split
                            </h3>
                        </div>
                        <div className="h-[250px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-x-[50px]">
                                <span className="text-2xl font-bold">{nodes.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="glass-card p-6 rounded-2xl border border-white/5 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-accent" /> Simulated Progression
                            </h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="attempt" tick={{ fontSize: 10, fill: '#888' }} stroke="transparent" />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#888' }} stroke="transparent" />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend />
                                    {Object.keys(lineData[0] || {}).filter(k => k !== 'attempt').map((k, i) => (
                                        <Line key={k} type="monotone" dataKey={k} stroke={`hsl(${i * 90}, 70%, 50%)`} dot={false} strokeWidth={2} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}