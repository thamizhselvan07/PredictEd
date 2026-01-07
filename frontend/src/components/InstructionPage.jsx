import React from 'react';
import { Button } from './Button';
import { AlertCircle, CheckCircle2, Circle, HelpCircle, Square, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InstructionPage({ examName, onProceed }) {
    // Determine exam type for specific rules
    const getExamRules = (name) => {
        const n = name?.toUpperCase() || 'GENERAL';
        if (n.includes('JEE')) {
            return {
                title: 'JEE MAIN / ADVANCED INSTRUCTIONS',
                marking: 'Correct Answer: +4 marks | Incorrect Answer: -1 mark',
                type: 'Computer Based Test (CBT)'
            };
        }
        if (n.includes('NEET')) {
            return {
                title: 'NEET INSTRUCTIONS',
                marking: 'Correct Answer: +4 marks | Incorrect Answer: -1 mark',
                type: 'Computer Based Test (Mock Mode)'
            };
        }
        if (n.includes('CLAT')) {
            return {
                title: 'CLAT INSTRUCTIONS',
                marking: 'Correct Answer: +1 mark | Incorrect Answer: -0.25 marks',
                type: 'Computer Based Test (CBT)'
            };
        }
        return {
            title: 'GENERAL EXAM INSTRUCTIONS',
            marking: 'Refer to specific question for marks.',
            type: 'Practice Mode'
        };
    };

    const rules = getExamRules(examName);

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-100 overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 bg-[#2d2d2d] border-b border-white/10 flex items-center justify-between px-6 shrink-0 shadow-md z-20">
                <h1 className="font-bold text-lg tracking-wide text-white">{rules.title}</h1>
                <div className="flex items-center gap-2 text-sm text-cyan-400 font-mono">
                    <Clock className="w-4 h-4" />
                    <span>Please Read Carefully</span>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* General Instructions */}
                    <section>
                        <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-white/10 pb-2">General Instructions</h2>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                            <li>The clock has been set at the server and the countdown timer at the top right corner of your screen will display the time remaining for you to complete the exam.</li>
                            <li>When the clock runs out, the exam ends by default - you are not required to end or submit your exam.</li>
                            <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</li>
                        </ol>
                    </section>

                    {/* Legend */}
                    <section>
                        <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-white/10 pb-2">Question Palette Legend</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center text-xs">1</div>
                                <span className="text-gray-400">You have not visited the question yet.</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                                <span className="text-gray-400">You have not answered the question.</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="w-8 h-8 rounded bg-green-500 text-white flex items-center justify-center text-xs font-bold">5</div>
                                <span className="text-gray-400">You have answered the question.</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="w-8 h-8 rounded bg-purple-600 text-white flex items-center justify-center text-xs font-bold">7</div>
                                <span className="text-gray-400">You have NOT answered the question, but have marked the question for review.</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                <div className="w-8 h-8 rounded bg-purple-600 text-white flex items-center justify-center text-xs font-bold relative">
                                    9
                                    <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full flex items-center justify-center text-[8px]">✔</div>
                                </div>
                                <span className="text-gray-400">The question(s) "Answered and Marked for Review" will be considered for evaluation.</span>
                            </div>
                        </div>
                    </section>

                    {/* Navigation */}
                    <section>
                        <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-white/10 pb-2">Navigating to a Question</h2>
                        <div className="space-y-2 text-gray-300">
                            <p>To answer a question, do the following:</p>
                            <ol className="list-decimal list-inside space-y-2 pl-4">
                                <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
                                <li>Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</li>
                                <li>Click on <strong>Mark for Review & Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Answering */}
                    <section>
                        <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-white/10 pb-2">Answering a Question</h2>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Procedure for answering a multiple choice type question:</h3>
                                <ol className="list-decimal list-inside space-y-1 pl-4">
                                    <li>To select your answer, click on the button of one of the options.</li>
                                    <li>To deselect your chosen answer, click on the button of the chosen option again or click on the <strong>Clear Response</strong> button.</li>
                                    <li>To change your chosen answer, click on the button of another option.</li>
                                    <li>To save your answer, you MUST click on the <strong>Save & Next</strong> button.</li>
                                    <li>To mark the question for review, click on the <strong>Mark for Review & Next</strong> button.</li>
                                </ol>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Procedure for answering a numerical question:</h3>
                                <ol className="list-decimal list-inside space-y-1 pl-4">
                                    <li>Enter your answer using the virtual numeric keypad.</li>
                                    <li>The keypad includes digits 0-9, decimal point (.), and negative sign (-) if applicable.</li>
                                    <li>You can clear your input using the <strong>Clear Response</strong> button or Backspace key.</li>
                                    <li>Answers must be saved using <strong>Save & Next</strong>.</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    {/* Exam Specifics */}
                    <section className="bg-cyan-900/10 border border-cyan-500/20 p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-cyan-400 mb-2">Exam Specific Rules: {rules.type}</h2>
                        <p className="text-lg font-medium text-white mb-1">{rules.marking}</p>
                        <p className="text-sm text-gray-400">Please ensure you understand the marking scheme before proceeding.</p>
                    </section>

                    {/* Agreement */}
                    <section className="pt-6 border-t border-white/10 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <input type="checkbox" id="agree" className="w-5 h-5 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500" />
                            <label htmlFor="agree" className="text-gray-300 select-none cursor-pointer">
                                I have read and understood the instructions. I agree that I am not carrying any prohibited material.
                            </label>
                        </div>
                    </section>
                </motion.div>
            </div>

            {/* Footer Action */}
            <footer className="h-20 bg-[#252525] border-t border-white/10 flex items-center justify-center shrink-0 z-20">
                <Button
                    onClick={onProceed}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-3 text-lg font-bold rounded shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
                >
                    PROCEED
                </Button>
            </footer>
        </div>
    );
}
