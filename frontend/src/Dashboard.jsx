import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './components/Card';
import { StatCard } from './components/StatCard';
import { ProgressBar } from './components/ProgressBar';
import { RiskBadge } from './components/Badge';
import { ActivityHeatmap } from './components/ActivityHeatmap';
import { PageLoader } from './components/LoadingSpinner';
import { getDashboardStats } from './api';
import { Line, Radar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
    Target,
    TrendingUp,
    Award,
    AlertTriangle,
    Brain,
    Zap,
    CheckCircle,
    Clock,
    Activity
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getDashboardStats(1);
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <PageLoader message="Initializing AI Neural Interface..." />;

    // Line Chart Data
    const lineChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
        datasets: [
            {
                label: 'Your Master',
                data: [55, 62, 70, 78, stats?.stats.average_score || 85],
                borderColor: '#06b6d4', // Cyan 500
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.5,
                fill: true,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 3,
            },
            {
                label: 'Top 10%',
                data: [75, 80, 85, 88, 92],
                borderColor: '#10B981', // Emerald 500
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(5, 5, 5, 0.9)',
                titleColor: '#e2e8f0',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                boxPadding: 4
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
                border: { dash: [5, 5], display: false },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        }
    };

    // Radar Chart for Topic Comparison
    const radarChartData = {
        labels: stats?.knowledge_graph?.slice(0, 6).map(n => n.topic) || [],
        datasets: [
            {
                label: 'Mastery',
                data: stats?.knowledge_graph?.slice(0, 6).map(n => n.strength * 100) || [],
                backgroundColor: 'rgba(139, 92, 246, 0.2)', // Violet
                borderColor: '#8b5cf6',
                borderWidth: 2,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 8,
            },
        ],
    };

    const radarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    display: false, // hide numbers for cleaner look
                    backdropColor: 'transparent',
                },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                pointLabels: { color: '#94a3b8', font: { size: 11, family: 'Inter' } },
                angleLines: { color: 'rgba(255, 255, 255, 0.05)' }
            },
        },
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 space-y-10 custom-scrollbar">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/50 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-sm font-mono text-primary tracking-wider uppercase">System Online</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 font-brand tracking-tight">
                            <span className="gradient-text">Command Center</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Real-time neural analysis of your learning trajectory and performance metrics.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/zen">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-card/50 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-xl flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-glass"
                            >
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Brain className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Focus Mode</div>
                                    <div className="font-bold text-lg">Enter Zen</div>
                                </div>
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Quizzes"
                        value={stats?.stats.total_quizzes || 0}
                        icon={CheckCircle}
                        variant="default"
                        subtitle="Missions Completed"
                    />
                    <StatCard
                        title="Average Score"
                        value={`${stats?.stats.average_score || 0}%`}
                        icon={Activity}
                        variant="success"
                        trend="up"
                        trendValue="12"
                        subtitle="Efficiency Rating"
                    />
                    <StatCard
                        title="Strongest Topic"
                        value={stats?.stats.strongest_topic || 'N/A'}
                        icon={Award}
                        variant="info"
                        subtitle="Dominant Sector"
                    />
                    <StatCard
                        title="Focus Area"
                        value={stats?.stats.weakest_topic || 'N/A'}
                        icon={Target}
                        variant="warning"
                        subtitle="Optimization Needed"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Charts Section - 8 Cols */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        {/* Performance Trend */}
                        <Card className="border-primary/10 bg-gradient-to-br from-card/80 to-card/40">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle>Performance Trajectory</CardTitle>
                                </div>
                                <select className="bg-background/50 border border-white/10 rounded-md text-sm px-3 py-1 focus:outline-none focus:border-primary/50 text-muted-foreground">
                                    <option>Last 30 Days</option>
                                    <option>All Time</option>
                                </select>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <Line options={lineChartOptions} data={lineChartData} />
                            </CardContent>
                        </Card>

                        {/* Recent Alerts / Risks */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="h-5 w-5 text-error animate-pulse" />
                                <h2 className="text-xl font-bold text-foreground">Critical Attention Areas</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stats?.weak_areas.map((area, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Card className="border-error/20 bg-gradient-to-br from-error/5 to-transparent hover:border-error/50 transition-all group">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="font-semibold text-lg group-hover:text-error transition-colors">{area.topic}</h3>
                                                    <RiskBadge level={area.risk_level} />
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-muted-foreground">Failure Probability</span>
                                                            <span className="font-mono font-bold text-error">
                                                                {Math.round(area.predicted_fail_probability * 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${area.predicted_fail_probability * 100}%` }}
                                                                className="h-full bg-error rounded-full shadow-glow-error"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar - 4 Cols */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        {/* Radar Chart */}
                        <Card className="overflow-hidden border-secondary/20 bg-gradient-to-b from-secondary/5 to-transparent">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-secondary/10">
                                        <Target className="h-5 w-5 text-secondary" />
                                    </div>
                                    <CardTitle>Skill Matrix</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[280px] flex items-center justify-center p-2">
                                {stats?.knowledge_graph?.length > 0 ? (
                                    <Radar options={radarChartOptions} data={radarChartData} />
                                ) : (
                                    <div className="text-center text-muted-foreground p-8">
                                        <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>Complete more diagnostics to generate matrix</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Topics List */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle>Topic Mastery Log</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {stats?.knowledge_graph?.slice(0, 5).map((node, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className={`w-1.5 h-1.5 rounded-full shadow-glow ${node.strength >= 0.7 ? 'bg-success' :
                                            node.strength >= 0.4 ? 'bg-warning' : 'bg-error'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium group-hover:text-primary transition-colors">{node.topic}</span>
                                                <span className="text-xs font-mono text-muted-foreground">{(node.strength * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${node.strength >= 0.7 ? 'bg-success' :
                                                        node.strength >= 0.4 ? 'bg-warning' : 'bg-error'
                                                        }`}
                                                    style={{ width: `${node.strength * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Heatmap Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="border-white/5 bg-black/40">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-foreground/80">Consistency & Activity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ActivityHeatmap />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
