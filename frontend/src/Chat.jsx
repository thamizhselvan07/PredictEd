import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { chatWithTutor } from './api';
import { Send, Bot, User, Sparkles, Lightbulb, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: "👋 Hello! I'm your AI Tutor powered by adaptive learning intelligence. I can help you understand concepts, answer questions, and provide personalized guidance. What would you like to learn today?"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    const quickSuggestions = [
        "Explain React Hooks",
        "What is a Knowledge Graph?",
        "Help with JavaScript closures",
        "Adaptive learning benefits"
    ];

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (customInput) => {
        const messageText = customInput || input;
        if (!messageText.trim()) return;

        const newMsgs = [...messages, { role: 'user', content: messageText }];
        setMessages(newMsgs);
        setInput("");
        setLoading(true);

        try {
            const savedContext = JSON.parse(localStorage.getItem('edu_context') || '{}');

            const res = await chatWithTutor(messageText, {
                stream: savedContext.stream || "General",
                exam: savedContext.exam || "General",
                subject: savedContext.subject || "General",
                topic: savedContext.topic || null
            });
            setTimeout(() => {
                setMessages([...newMsgs, { role: 'bot', content: res.data.reply }]);
                setLoading(false);
            }, 800);
        } catch (err) {
            setMessages([...newMsgs, { role: 'bot', content: "I apologize, I'm having trouble processing that right now. Please try again." }]);
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Ambient background for chat */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />
            <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl border border-white/10"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-primary via-cyan-500 to-blue-600 rounded-xl shadow-glow relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                <Bot size={28} className="text-white relative z-10" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold font-brand flex items-center gap-2">
                                    AI Neural Tutor
                                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <BrainCircuit className="h-3 w-3" />
                                    <span>Adaptive Intelligence Module active</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/5 bg-black/20">
                            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                            <span className="text-sm font-medium text-success tracking-wide uppercase text-xs">System Online</span>
                        </div>
                    </div>
                </motion.div>

                {/* Chat Container */}
                <Card className="flex-1 flex flex-col glass-card border-primary/10 shadow-glass overflow-hidden bg-black/40 backdrop-blur-2xl">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar min-h-[500px]">
                        <AnimatePresence mode="popLayout">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: i * 0.05, type: 'spring' }}
                                    className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {m.role === 'bot' && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shadow-glow mt-2">
                                            <Bot size={20} className="text-primary" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-5 shadow-lg backdrop-blur-md transition-all duration-300 ${m.role === 'user'
                                        ? 'bg-primary/20 border border-primary/30 text-white rounded-tr-sm hover:bg-primary/25'
                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm hover:bg-white/10'
                                        }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap text-base">{m.content}</p>
                                    </div>
                                    {m.role === 'user' && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center mt-2">
                                            <User size={20} className="text-secondary-foreground" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex gap-4"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shadow-glow">
                                    <Bot size={20} className="text-primary" />
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 backdrop-blur-md">
                                    <div className="flex gap-1.5 cursor-pointer">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_infinite_0ms]"></div>
                                        <div className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_infinite_200ms]"></div>
                                        <div className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_infinite_400ms]"></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Suggestions */}
                    {messages.length === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 pb-4"
                        >
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Inquiries</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quickSuggestions.map((suggestion, i) => (
                                    <Button
                                        key={i}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSend(suggestion)}
                                        className="bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-primary-foreground text-muted-foreground transition-all duration-300 text-xs md:text-sm"
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Input */}
                    <div className="p-4 md:p-6 border-t border-white/10 bg-background/40 backdrop-blur-xl relative z-20">
                        <div className="flex gap-3 relative">
                            <input
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 text-foreground shadow-inner"
                                placeholder="Type your question here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                            <Button
                                onClick={() => handleSend()}
                                size="lg"
                                disabled={!input.trim() || loading}
                                className={`px-6 transition-all duration-300 ${input.trim() ? 'bg-primary hover:bg-primary-dark shadow-glow' : 'bg-muted text-muted-foreground'}`}
                            >
                                <Send size={20} className={input.trim() ? 'text-black' : ''} />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
