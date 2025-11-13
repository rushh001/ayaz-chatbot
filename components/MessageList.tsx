'use client';

import { Message } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.03,
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start gap-2 sm:gap-4 max-w-[90%] sm:max-w-[85%] ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: index * 0.03 + 0.1, 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
                className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 ring-1 sm:ring-2 ring-purple-400/50'
                    : 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 ring-1 sm:ring-2 ring-cyan-400/50'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: message.role === 'user' ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 + 0.15, type: "spring", stiffness: 200 }}
                className={`rounded-2xl sm:rounded-3xl px-3 py-2.5 sm:px-5 sm:py-4 shadow-xl sm:shadow-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white ring-1 ring-purple-400/30'
                    : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 ring-1 ring-white/10'
                }`}
              >
                <p className="text-xs sm:text-[15px] leading-relaxed font-medium break-words">{message.content}</p>
                {message.isAudio && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 + 0.3 }}
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs opacity-80 mt-1.5 sm:mt-2 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-white/10 backdrop-blur-sm"
                  >
                    🎤 Voice message
                  </motion.span>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
