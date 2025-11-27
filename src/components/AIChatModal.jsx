
import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Crown, Send, Bot, User, Loader2, X } from 'lucide-react'
import { API_BASE_URL } from '../config'


const AIChatModal = ({ isOpen, onClose, destination = null }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMsg = destination
        ? `✈️ Hi! I'm TravelBot, your AI assistant for ${destination.name}. I'm trained exclusively on tourism topics.Ask me anything about planning your trip!`
        : `✈️ Hi! I'm TravelBot, your AI travel assistant trained exclusively on tourism! Ask me anything about destinations, itineraries, budgets, or travel tips!`

      setMessages([{
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date()
      }])
    }
  }, [isOpen, destination])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Prepare messages for the API
      const apiMessages = [
        {
          role: 'system',
          content: destination
            ? `You are TravelBot, an expert AI travel assistant for ${destination.name}. You are helpful, enthusiastic, and knowledgeable about tourism, local culture, food, and travel tips for ${destination.name}. Keep answers concise and engaging.`
            : "You are TravelBot, an expert AI travel assistant. You are helpful, enthusiastic, and knowledgeable about tourism, destinations, itineraries, and travel tips. Keep answers concise and engaging."
        },
        ...messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content
        })),
        { role: "user", content: userMessage.content }
      ]

      const response = await fetch(`${API_BASE_URL}/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: apiMessages
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to get response")
      }

      const botContent = data.response || "I couldn't generate a response."

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botContent,
        timestamp: new Date()
      }])

    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error while thinking. Please try again later.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const getCreditBadge = () => {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
        <Crown className="w-4 h-4" />
        Unlimited
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white p-4 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-bold">TravelBot AI</h3>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Free Unlimited</span>
              </div>
              {destination && (
                <p className="text-sm opacity-90">Expert for {destination.name}</p>
              )}
              <p className="text-xs opacity-75 mt-1">
                Tourism-focused AI trained to help you travel
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getCreditBadge()}
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.timestamp.getTime()}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : message.role === 'system'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-500" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-5 h-5 flex-shrink-0 mt-0.5 text-white" />
                  )}
                  <div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
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

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your trip..."
              className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none resize-none"
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${input.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
            <span>💡 Tip: Press Enter to send, Shift+Enter for new line</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIChatModal
