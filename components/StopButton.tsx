'use client';

import { motion } from 'framer-motion';
import { Square } from 'lucide-react';

interface StopButtonProps {
  onStop: () => void;
  disabled?: boolean;
}

export default function StopButton({ onStop, disabled }: StopButtonProps) {
  return (
    <motion.button
      onClick={onStop}
      disabled={disabled}
      className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-red-500/50 ring-2 ring-red-400/50"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      title="Stop audio response"
      animate={{ 
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Square className="w-6 h-6 text-white fill-white" />
    </motion.button>
  );
}
