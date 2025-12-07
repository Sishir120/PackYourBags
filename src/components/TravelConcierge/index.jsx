
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { useChatEngine } from './useChatEngine';
import ChatBubble from './ChatBubble';

const TravelConcierge = () => {
    const { messages, isTyping, isOpen, toggleChat, sendMessage } = useChatEngine();
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    // Handle Quick Actions
    const handleQuickAction = (text) => {
        sendMessage(text);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputRef.current?.value) {
            sendMessage(inputRef.current.value);
            inputRef.current.value = '';
        }
    };

    return (
        <>
            {/* 1. Floating Action Button (FAB) */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleChat}
                        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg shadow-blue-500/30 text-white flex items-center gap-2 group"
                    >
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium pr-0 group-hover:pr-2">
                            Ask AI Concierge
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 2. Main Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden font-inter"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Travel Concierge</h3>
                                    <p className="text-xs text-blue-100 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        Online & Ready
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleChat}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Quick Actions Bar */}
                        <div className="bg-gray-50/80 p-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
                            {[
                                { icon: '💰', text: 'Simulate Budget' },
                                { icon: '📅', text: 'Plan Itinerary' },
                                { icon: '🍜', text: 'Local Food?' },
                                { icon: '🌤️', text: 'Best Time?' }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickAction(action.text)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors whitespace-nowrap shadow-sm"
                                >
                                    <span>{action.icon}</span>
                                    {action.text}
                                </button>
                            ))}
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white/50 scroll-smooth"
                        >
                            {messages.map((msg) => (
                                <ChatBubble key={msg.id} message={msg} />
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2 items-center text-gray-400 text-sm ml-2"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Concierge is thinking...</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Ask about destinations, flights, or tips..."
                                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center w-10 h-10"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TravelConcierge;
