import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Clock, AlertCircle, FileText, ChevronRight, X, BrainCircuit, CheckCircle, Target } from 'lucide-react';
import { syllabusData } from './data/syllabusData';

export default function Syllabus() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedExam, setSelectedExam] = useState(null);

    const categories = ["All", ...new Set(syllabusData.map(d => d.category))];

    const filteredData = selectedCategory === "All"
        ? syllabusData
        : syllabusData.filter(d => d.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 space-y-8 pb-20">
            {/* Header */}
            <header className="max-w-7xl mx-auto space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">
                    Official Exam Syllabus
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Comprehensive curriculum roadmap, exam patterns, and official marking schemes for all major competitive exams.
                </p>
            </header>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                            ? 'bg-primary text-black shadow-glow'
                            : 'bg-muted/30 border border-white/5 hover:bg-white/10'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Exam Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((exam) => (
                    <motion.div
                        key={exam.id}
                        layoutId={`card-${exam.id}`}
                        onClick={() => setSelectedExam(exam)}
                        className={`glass-card p-6 rounded-2xl cursor-pointer group hover:border-primary/50 transition-all ${exam.readOnly ? 'opacity-75 grayscale' : ''}`}
                        whileHover={{ y: -5 }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {exam.name}
                            </h3>
                            {exam.readOnly && (
                                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30">
                                    Not Eligible
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{exam.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-secondary" />
                                <span>{exam.questions}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground/70">
                            <span>{exam.category}</span>
                            <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                                View Details <ChevronRight className="h-3 w-3" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Exam Detail Modal */}
            <AnimatePresence>
                {selectedExam && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedExam(null)}
                    >
                        <motion.div
                            layoutId={`card-${selectedExam.id}`}
                            className="bg-card border border-border w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 md:p-8 border-b border-border bg-muted/20 flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground mb-2">{selectedExam.name}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                            <Clock className="h-4 w-4 text-primary" /> {selectedExam.duration}
                                        </div>
                                        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                            <Target className="h-4 w-4 text-secondary" /> {selectedExam.marking}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedExam(null)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X className="h-6 w-6 text-foreground" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">

                                {/* Exam Pattern Section */}
                                <section>
                                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                                        <BrainCircuit className="h-5 w-5" /> Exam Pattern
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedExam.pattern.map((pat, idx) => (
                                            <div key={idx} className="bg-muted/20 border border-border p-4 rounded-xl">
                                                <div className="text-foreground font-medium mb-1">{pat.subject}</div>
                                                <div className="text-sm text-muted-foreground mb-1">{pat.q}</div>
                                                {pat.note && <div className="text-xs text-muted-foreground/70">{pat.note}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Syllabus Roadmap */}
                                <section>
                                    <h3 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                                        <Book className="h-5 w-5" /> Syllabus Roadmap
                                    </h3>

                                    <div className="space-y-8">
                                        {Object.entries(selectedExam.syllabus).map(([subject, topics]) => (
                                            <div key={subject} className="relative pl-8 border-l border-border">
                                                <div className="absolute -left-3 top-0 w-6 h-6 bg-background border border-primary rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                                </div>
                                                <h4 className="text-lg font-medium text-foreground mb-4">{subject}</h4>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {topics.map((topic, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 bg-card hover:bg-muted/50 p-3 rounded-lg border border-border transition-colors group">
                                                            {topic.difficulty === 'Easy' && <div className="w-2 h-2 rounded-full bg-green-500" title="Easy" />}
                                                            {topic.difficulty === 'Medium' && <div className="w-2 h-2 rounded-full bg-yellow-500" title="Medium" />}
                                                            {topic.difficulty === 'Hard' && <div className="w-2 h-2 rounded-full bg-red-500" title="Hard" />}
                                                            {topic.difficulty === 'Info' && <div className="w-2 h-2 rounded-full bg-blue-500" title="Info" />}

                                                            <div className="flex-1">
                                                                <div className="text-sm text-foreground/90 font-medium group-hover:text-primary transition-colors">{topic.name}</div>
                                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Weightage: {topic.weight}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
