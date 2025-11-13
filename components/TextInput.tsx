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
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={disabled}
          className="w-full px-6 py-4 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base font-medium"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: message.trim() ? 1 : 0 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
        />
      </div>
      <motion.button
        type="submit"
        disabled={!message.trim() || disabled}
        className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-cyan-500/30 ring-2 ring-cyan-400/50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send className="w-6 h-6 text-white" />
      </motion.button>
    </form>
  );
}
