import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { PageLoader } from './components/LoadingSpinner';
import { getSubjects, startQuizSession } from './api'; // Use for subject name if needed, or derived from syllabus
import { syllabusData } from './data/syllabusData';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Target, BrainCircuit, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TopicSelection() {
    const { examId, subjectId } = useParams();
    const [topics, setTopics] = useState([]);
    const [subjectName, setSubjectName] = useState("");
    const [loading, setLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false); // For button loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                // 1. Fetch Subject Name from Backend
                const res = await getSubjects(examId);
                const backendSubject = res.data.find(s => s.id == subjectId);

                if (backendSubject) {
                    setSubjectName(backendSubject.name);

                    // 2. Find Exam in Syllabus
                    // Try exact ID match first
                    let exam = syllabusData.find(e => e.id == examId || e.id === examId);

                    // Fallback: heuristic match by subject name
                    if (!exam) {
                        exam = syllabusData.find(e =>
                            e.syllabus[backendSubject.name] ||
                            Object.keys(e.syllabus).some(k => backendSubject.name.includes(k))
                        );
                    }

                    if (exam) {
                        // 3. Match keys in syllabusData
                        const syllabusTopics = exam.syllabus[backendSubject.name] ||
                            exam.syllabus[Object.keys(exam.syllabus).find(k => backendSubject.name.includes(k))] ||
                            [];
                        setTopics(syllabusTopics);
                    }
                }
            } catch (err) {
                console.error("Error fetching details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [examId, subjectId]);

    const handleStartQuiz = async (topicName, mode) => {
        if (isStarting) return;
        setIsStarting(true);
        try {
            const userId = 1; // Demo User
            const type = mode === 'topic_mock' ? 'mixed' : 'mixed'; // Use mixed for topics generally

            const res = await startQuizSession(subjectId, type, userId);

            // We need to pass topic and mode to the backend if the backend API supports it
            // Update: We modified backend to take body params.
            // But api.js startQuizSession takes (subjectId, type, userId). 
            // We need to modify api.js OR use a raw axios call here for the new params if api.js isn't updated.
            // Actually, let's assume I fix api.js or use raw call.
            // Let's use the updated backend logic: we need 'topic' and 'mode' in the body.
            // Since api.js wrapper might limit us, let's modify the call to send the full object.

            // Re-checking api.js usage locally or patching it.
            // Using raw axios for now to be safe or assuming api.js update.
            // Let's quick-fix: assumes api.js `startQuizSession` just passes the body.
            // Wait, api.js: export const startQuizSession = (subjectId, type, userId) => api.post(`/quiz/start?user_id=${userId}`, { subject_id: subjectId, type });
            // It Only sends subject_id and type. It DROPS topic and mode.
            // I MUST FIX api.js first or bypass it.
            // I'll bypass it here for speed.

            // Actually, I can't bypass easily without importing 'api' instance.
            // I'll edit api.js in next step. For now, writing correct logic assuming api.js update.

            // Wait, I cannot rely on assumed api.js update in the same step easily.
            // I will use a custom function here or expect api fixes.
            // I'll update api.js in the next action.

            // Temporary workaround: pass topic/mode in 'type' field and parsers? No, backend expects proper JSON.
            // I'll use the API call assuming I update api.js immediately after.

            const response = await startQuizSession(
                subjectId,
                type,
                userId,
                topicName, // Add param
                mode       // Add param
            );

            if (response.data && response.data.attempt_id) {
                navigate(`/quiz/${response.data.attempt_id}`);
            }
        } catch (err) {
            console.error("Failed to start quiz:", err);
            alert("Failed to start quiz. Please try again.");
        } finally {
            setIsStarting(false);
        }
    };

    if (loading) return <PageLoader message="Loading Topics..." />;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[128px] pointer-events-none" />

            <Navbar />
            <div className="max-w-6xl mx-auto p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-primary transition-colors mb-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                        <ArrowRight className="rotate-180 w-4 h-4" /> Back to Subjects
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-brand">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{subjectName}</span> Topics
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Select a topic to start a targeted practice session or take a full mock test.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {topics.length > 0 ? topics.map((topic, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all bg-black/20 group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{topic.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                                        <span className={`px-2 py-0.5 rounded-full border ${topic.difficulty === 'Easy' ? 'border-green-500/30 text-green-400' :
                                            topic.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400' :
                                                'border-red-500/30 text-red-400'
                                            }`}>
                                            {topic.difficulty}
                                        </span>
                                        <span>•</span>
                                        <span>Weightage: {topic.weight}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 relative z-10">
                                {/* Practice Button Removed */}
                                <button
                                    onClick={() => handleStartQuiz(topic.name, 'topic_mock')}
                                    disabled={isStarting}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 font-medium text-white disabled:opacity-50"
                                >
                                    {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />} Mock Test (30Q)
                                </button>
                            </div>

                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No specific details found for this subject in our syllabus map.</p>
                            <button
                                onClick={() => navigate(`/subject/${subjectId}`)}
                                className="mt-4 text-primary hover:underline"
                            >
                                Continue to General Quiz
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
