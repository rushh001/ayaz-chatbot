'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types';
import AudioRecorder from '@/components/AudioRecorder';
import MessageList from '@/components/MessageList';
import TextInput from '@/components/TextInput';
import StopButton from '@/components/StopButton';
import { motion } from 'framer-motion';
import { Trash2, Volume2 } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Load messages from localStorage on mount
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Load voices for text-to-speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleAudioTranscription = (transcription: string, response: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: transcription,
      timestamp: Date.now(),
      isAudio: true,
    };

    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: response,
      timestamp: Date.now() + 1,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  const handleTextMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Get last 5 messages as context (excluding the current message)
      const context = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText,
          context: context,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('chat_messages');
      localStorage.removeItem('ai_chat_context');
    }
  };

  const speakLastMessage = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistantMessage && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      
      // Set female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('female') ||
        voice.name.includes('Zira') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Microsoft Zira') ||
        (voice.lang.includes('en') && voice.name.includes('Female'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-[120%] h-[120%] bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-[120%] h-[120%] bg-gradient-to-tl from-purple-500/40 to-pink-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="p-4 backdrop-blur-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-b border-white/20 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                ✨ AI Chatbot
              </h1>
              <p className="text-white/80 text-xs mt-0.5 font-medium">
                🎤 Speak or 💬 Type to start your conversation
              </p>
            </motion.div>
            <motion.div 
              className="flex space-x-3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {isSpeaking && (
                <StopButton onStop={stopSpeaking} />
              )}
              <motion.button
                onClick={speakLastMessage}
                disabled={isSpeaking}
                className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all backdrop-blur-lg border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="Repeat last response"
              >
                <Volume2 className="w-5 h-5 text-emerald-300" />
              </motion.button>
              <motion.button
                onClick={clearChat}
                className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 transition-all backdrop-blur-lg border border-red-400/30 shadow-lg"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5 text-red-300" />
              </motion.button>
            </motion.div>
          </div>
        </motion.header>

        {/* Messages */}
        <div className="flex-1 overflow-hidden min-h-0">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl mb-6 filter drop-shadow-2xl"
              >
                🤖
              </motion.div>
              <motion.h2 
                className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Welcome to AI Chatbot
              </motion.h2>
              <motion.p 
                className="text-white/80 max-w-lg text-lg leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Start a conversation by typing a message or using voice input. 
                I&apos;ll remember the last <span className="text-cyan-400 font-bold">5 messages</span> for context.
              </motion.p>
              <motion.div
                className="mt-8 flex gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <span className="text-white/70 text-sm">💡 Smart Context</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <span className="text-white/70 text-sm">🎯 Fast Response</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <span className="text-white/70 text-sm">🔒 Secure</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Input area */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="p-4 backdrop-blur-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border-t border-white/20 shadow-2xl"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <TextInput
                onSendMessage={handleTextMessage}
                disabled={isProcessing}
              />
            </div>
            <AudioRecorder
              onTranscriptionComplete={handleAudioTranscription}
              disabled={isProcessing}
              context={messages.slice(-5).map(msg => ({
                role: msg.role,
                content: msg.content,
              }))}
            />
          </div>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-2 text-white/80 text-sm mt-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
              />
              <span className="font-medium">Processing your request...</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
