'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function TextInput({ onSendMessage, disabled }: TextInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={disabled}
          className="w-full px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm font-medium"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: message.trim() ? 1 : 0 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
        />
      </div>
      <motion.button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`relative p-3 rounded-2xl transition-all duration-300 ${
          message.trim() && !disabled
            ? 'bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 shadow-xl shadow-cyan-500/60 ring-3 ring-cyan-400/70'
            : 'bg-gradient-to-br from-purple-500/50 via-pink-500/50 to-rose-500/50 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        whileHover={{ scale: message.trim() && !disabled ? 1.05 : 1 }}
        whileTap={{ scale: 0.95 }}
        animate={message.trim() && !disabled ? {
          boxShadow: [
            '0 0 0 0 rgba(34, 211, 238, 0.7)',
            '0 0 0 15px rgba(34, 211, 238, 0)',
          ]
        } : {}}
        transition={message.trim() && !disabled ? {
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}}
      >
        <Send className="w-5 h-5 text-white" />
      </motion.button>
    </form>
  );
}
