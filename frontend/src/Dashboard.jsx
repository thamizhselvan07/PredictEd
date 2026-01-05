import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './components/Card';
import { StatCard } from './components/StatCard';
import { ProgressBar } from './components/ProgressBar';
import { RiskBadge } from './components/Badge';
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
    Clock
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

    if (loading) return <PageLoader message="Loading AI Analytics Dashboard..." />;

    // Line Chart Data
    const lineChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
        datasets: [
            {
                label: 'Mastery Score',
                data: [55, 62, 70, 78, stats?.stats.average_score || 85],
                borderColor: '#2D68C4',
                backgroundColor: 'rgba(45, 104, 196, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#2D68C4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
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
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#E5E7EB',
                bodyColor: '#9CA3AF',
                borderColor: 'rgba(45, 104, 196, 0.5)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            }
        },
        scales: {
            y: { 
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF' },
                border: { dash: [5, 5] },
            },
            x: { 
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF' },
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
                label: 'Current Mastery',
                data: stats?.knowledge_graph?.slice(0, 6).map(n => n.strength * 100) || [],
                backgroundColor: 'rgba(45, 104, 196, 0.2)',
                borderColor: '#2D68C4',
                borderWidth: 2,
                pointBackgroundColor: '#2D68C4',
                pointBorderColor: '#fff',
                pointRadius: 4,
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
                    color: '#9CA3AF',
                    backdropColor: 'transparent',
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: { color: '#E5E7EB', font: { size: 11 } },
            },
        },
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 space-y-8 custom-scrollbar">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            <span className="gradient-text">AI Learning Dashboard</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Real-time insights into your adaptive learning journey
                        </p>
                    </div>
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="glass-card px-6 py-3 rounded-xl border"
                    >
                        <div className="text-sm text-muted-foreground">Mastery Level</div>
                        <div className="text-2xl font-bold text-primary">
                            {stats?.stats.mastery_level}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Quizzes"
                        value={stats?.stats.total_quizzes || 0}
                        icon={CheckCircle}
                        variant="default"
                        subtitle="Completed assessments"
                    />
                    <StatCard
                        title="Average Score"
                        value={`${stats?.stats.average_score || 0}%`}
                        icon={TrendingUp}
                        variant="success"
                        trend="up"
                        trendValue="12"
                        subtitle="vs last week"
                    />
                    <StatCard
                        title="Strongest Topic"
                        value={stats?.stats.strongest_topic || 'N/A'}
                        icon={Award}
                        variant="info"
                        subtitle="Best performance area"
                    />
                    <StatCard
                        title="Focus Area"
                        value={stats?.stats.weakest_topic || 'N/A'}
                        icon={Target}
                        variant="warning"
                        subtitle="Needs improvement"
                    />
                </div>

                {/* AI Predicted Risk Areas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="h-6 w-6 text-error animate-pulse" />
                        <h2 className="text-2xl font-bold text-error">AI Predicted Risk Areas</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats?.weak_areas.map((area, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <Card className="border-error/30 bg-gradient-to-br from-error/10 to-error/5 hover:shadow-glow transition-all">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-xl">{area.topic}</CardTitle>
                                            <RiskBadge level={area.risk_level} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-muted-foreground">Failure Probability</span>
                                                <span className="font-mono font-bold text-error">
                                                    {Math.round(area.predicted_fail_probability * 100)}%
                                                </span>
                                            </div>
                                            <ProgressBar 
                                                value={area.predicted_fail_probability * 100} 
                                                variant="error"
                                                showLabel={false}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-muted-foreground">Current Mastery</span>
                                                <span className="font-mono font-bold text-warning">
                                                    {area.current_mastery}%
                                                </span>
                                            </div>
                                            <ProgressBar 
                                                value={area.current_mastery} 
                                                variant="warning"
                                                showLabel={false}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Knowledge Graph Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Brain className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Topic Mastery Overview</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats?.knowledge_graph?.map((node, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Card className="glass-card hover:border-primary/50 transition-all">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-sm">{node.topic}</h3>
                                            <Zap className={`h-4 w-4 ${
                                                node.strength >= 0.7 ? 'text-success' :
                                                node.strength >= 0.4 ? 'text-warning' : 'text-error'
                                            }`} />
                                        </div>
                                        <ProgressBar 
                                            value={node.strength * 100}
                                            variant={
                                                node.strength >= 0.7 ? 'success' :
                                                node.strength >= 0.4 ? 'warning' : 'error'
                                            }
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    <Card className="glass-card">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                <CardTitle>Performance Trend</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="h-80">
                            <Line options={lineChartOptions} data={lineChartData} />
                        </CardContent>
                    </Card>
                    
                    <Card className="glass-card">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                <CardTitle>Topic Comparison Radar</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            {stats?.knowledge_graph?.length > 0 ? (
                                <Radar options={radarChartOptions} data={radarChartData} />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Complete more quizzes to see topic comparison</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
