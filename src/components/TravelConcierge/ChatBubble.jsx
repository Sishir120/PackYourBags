
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const ChatBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;
    const isFallback = message.isFallback;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white/80 backdrop-blur-md border border-gray-100 text-gray-800 rounded-bl-none shadow-md'
                    }`}
            >
                {isError && (
                    <div className="text-xs text-red-500 font-bold mb-1 flex items-center gap-1">
                        ⚠️ Offline Mode
                    </div>
                )}
                {isFallback && !isError && (
                    <div className="text-xs text-amber-600 font-bold mb-1 flex items-center gap-1">
                        ⚡ Quick Mode
                    </div>
                )}

                <div className="markdown-content">
                    {isUser ? (
                        message.content
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-blue-700" {...props} />
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatBubble;
