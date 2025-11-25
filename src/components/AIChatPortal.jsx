import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowLeft, Crown, Zap, AlertCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { supabase, subscription } from '../utils/supabase';

const AIChatPortal = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isTravelPro, setIsTravelPro] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check user session
    checkUserSession();
    
    // Add welcome message
    const welcomeMsg = `✈️ Welcome to the PackYourBags AI Chat Portal! I'm TravelBot, your dedicated travel assistant. Ask me anything about destinations, trip planning, budgets, or travel tips!`;
    
    setMessages([{
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const checkUserSession = async () => {
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          fetchCredits();
        } else {
          setCredits('login_required');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    }
  };

  const fetchCredits = async () => {
    // Try Supabase first
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCredits('login_required');
          return;
        }
        
        // Get subscription status from Supabase
        const result = await subscription.getStatus();
        if (result.success) {
          setCredits(result.subscription.credits);
          setIsPremium(result.subscription.isPremium);
          setIsTravelPro(result.subscription.isTravelPro);
          return;
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      
      // Try Supabase session first
      let useSupabase = false;
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
            useSupabase = true;
          }
        } catch (error) {
          // Fall through to JWT approach
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/ai-chat/message`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: input
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }]);
        
        // Update credits and subscription status
        if (data.credits_remaining !== undefined) {
          setCredits(data.credits_remaining);
          setIsPremium(data.is_premium);
          setIsTravelPro(data.is_travelpro || false);
        }
      } else if (data.subscription_required) {
        setMessages(prev => [...prev, {
          role: 'system',
          content: '🚫 ' + data.error,
          timestamp: new Date()
        }]);
        setShowSubscriptionModal(true);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Network error. Please check your connection and try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCreditBadge = () => {
    if (isTravelPro) {
      return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-full text-sm font-bold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          TravelPro Unlimited
        </div>
      );
    } else if (isPremium) {
      return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          <Crown className="w-4 h-4" />
          Unlimited
        </div>
      );
    } else if (credits === 'login_required') {
      return (
        <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
          <AlertCircle className="w-4 h-4" />
          Login for 10 free credits
        </div>
      );
    } else if (typeof credits === 'number') {
      return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
          credits > 5 ? 'bg-green-100 text-green-700' : 
          credits > 2 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-red-100 text-red-700'
        }`}>
          <Zap className="w-4 h-4" />
          {credits} {credits === 1 ? 'credit' : 'credits'}
        </div>
      );
    } else if (credits === 'unlimited') {
      return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          <Crown className="w-4 h-4" />
          Unlimited
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                  PackYourBags
                </span>
              </a>
              <span className="hidden sm:block text-sm text-gray-500">AI Chat Portal</span>
            </div>
            
            <div className="flex items-center gap-4">
              {getCreditBadge()}
              <a 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-7 h-7" />
                  TravelBot AI Assistant
                </h1>
                <p className="text-purple-100 mt-1">
                  Your 24/7 travel planning companion
                </p>
              </div>
              {isTravelPro && (
                <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                  TravelPro
                </span>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.timestamp.getTime()}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : message.role === 'system'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <Bot className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-500" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                    )}
                    <div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-500" />
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel..."
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none resize-none"
                rows="1"
                disabled={isLoading}
                style={{ minHeight: '48px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center justify-between">
              <span>💡 Tip: Press Enter to send, Shift+Enter for new line</span>
              {(!isPremium && typeof credits === 'number' && credits <= 3) && (
                <span className="text-orange-600 font-medium">
                  ⚠️ Low credits! Subscribe for unlimited access
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Travel Expertise</h3>
            <p className="text-gray-600 text-sm">
              Get personalized recommendations for destinations, activities, and travel tips from our AI travel expert.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Premium Features</h3>
            <p className="text-gray-600 text-sm">
              Upgrade to Premium for unlimited conversations, detailed itinerary planning, and priority support.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">24/7 Availability</h3>
            <p className="text-gray-600 text-sm">
              Our AI assistant is always available to help you plan your next adventure, anytime, anywhere.
            </p>
          </div>
        </div>
      </main>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 mb-6">
                {credits === 'login_required' 
                  ? 'Login to get 10 free AI questions, or subscribe for unlimited access!'
                  : 'You\'ve used all your free credits. Subscribe for unlimited AI conversations!'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Premium Plan */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
                  <h4 className="font-bold text-lg mb-2">Premium Plan</h4>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                    $9.99<span className="text-sm">/month</span>
                  </div>
                  <ul className="text-left text-sm space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Unlimited AI conversations
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Detailed itinerary planning
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Priority support
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      setShowSubscriptionModal(false);
                      window.location.href = '/subscription';
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Choose Premium
                  </button>
                </div>
                
                {/* TravelPro Special Plan */}
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-4">
                  <h4 className="font-bold text-lg mb-2">TravelPro Special</h4>
                  <div className="text-2xl font-bold text-blue-700 mb-3">
                    $14.99<span className="text-sm">/month</span>
                  </div>
                  <ul className="text-left text-sm space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Unlimited TravelPro AI
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Advanced reasoning
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      Specialized knowledge
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      setShowSubscriptionModal(false);
                      window.location.href = '/subscription?plan=travelpro';
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Choose TravelPro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatPortal;