
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom Hook: useChatEngine
 * Manages the AI Chat state, API interaction, and context awareness.
 */
export const useChatEngine = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm your AI Travel Concierge. I can help you plan trips, find budget deals, or tell you about the place you're looking at. Where are we going today?",
            id: 'welcome-msg'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Determine context based on current URL
    const getContext = useCallback(() => {
        const path = location.pathname;
        if (path.includes('/destination/')) {
            // Extract slug or ID
            const parts = path.split('/');
            const destId = parts[parts.length - 1];
            return `User is currently viewing destination page: ${destId}. Tailor responses to this location.`;
        }
        if (path.includes('/blog')) return "User is browsing the blog.";
        if (path === '/') return "User is on the Home/Landing page.";
        return "User is browsing the application.";
    }, [location]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // 1. Optimistic UI Update
        const userMsg = { role: 'user', content: text, id: Date.now().toString() };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        setError(null);

        try {
            // 2. Prepare Payload with Context
            const context = getContext();

            // 3. API Call
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg], // Send history
                    destination: context // Pass context as "destination" field for the backend to use
                })
            });

            const data = await response.json();

            if (!data.success) throw new Error(data.error || 'Failed to get response');

            // 4. Handle Response
            const botMsg = {
                role: 'assistant',
                content: data.response,
                id: (Date.now() + 1).toString(),
                isFallback: data.is_fallback // Flag for UI to show "Offline" badge if needed
            };

            setMessages(prev => [...prev, botMsg]);

        } catch (err) {
            console.error('Chat Engine Error:', err);
            setError('Connection issue. Switched to offline mode.');

            // Fallback response if API fails hard
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting to the cloud, but I can still help you browse! Try asking about the destination shown on screen.",
                id: (Date.now() + 1).toString(),
                isError: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleChat = () => setIsOpen(prev => !prev);
    const clearHistory = () => {
        setMessages([{
            role: 'assistant',
            content: "History cleared. What's next on your travel list?",
            id: Date.now().toString()
        }]);
    };

    return {
        messages,
        isTyping,
        isOpen,
        error,
        sendMessage,
        toggleChat,
        clearHistory,
        setIsOpen // Export setter for external triggers
    };
};
