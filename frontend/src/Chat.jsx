import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { chatWithTutor } from './api';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';
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
            const res = await chatWithTutor(messageText);
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
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-5xl mx-auto w-full p-6 flex flex-col gap-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl border"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-glow">
                                <Bot size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    AI Tutor
                                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Powered by adaptive learning intelligence • Always here to help
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                            <span className="text-sm font-medium text-success">Online</span>
                        </div>
                    </div>
                </motion.div>

                {/* Chat Container */}
                <Card className="flex-1 flex flex-col glass-card border-primary/20 shadow-glow overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar min-h-[500px]">
                        <AnimatePresence>
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {m.role === 'bot' && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                                            <Bot size={20} className="text-white" />
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] rounded-2xl p-4 ${
                                        m.role === 'user'
                                            ? 'bg-gradient-to-br from-primary to-accent text-white shadow-glow rounded-tr-sm'
                                            : 'glass-card border rounded-tl-sm'
                                    }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                    </div>
                                    {m.role === 'user' && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <User size={20} className="text-foreground" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className="glass-card border rounded-2xl rounded-tl-sm p-4">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Suggestions (show only when no messages from user) */}
                    {messages.length === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-6 pb-4"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="h-4 w-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Quick suggestions:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quickSuggestions.map((suggestion, i) => (
                                    <Button
                                        key={i}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSend(suggestion)}
                                        className="glass-card hover:border-primary/50 transition-all"
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Input */}
                    <div className="p-6 border-t border-white/10 bg-background/50 backdrop-blur-xl">
                        <div className="flex gap-3">
                            <input
                                className="flex-1 bg-muted/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
                                placeholder="Ask anything about your learning journey..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                            <Button 
                                onClick={() => handleSend()} 
                                size="lg"
                                disabled={!input.trim() || loading}
                                className="px-6 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all"
                            >
                                <Send size={20} />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            AI Tutor can make mistakes. Always verify important information.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
