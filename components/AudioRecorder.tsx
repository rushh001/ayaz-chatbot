'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string, response: string) => void;
  disabled?: boolean;
  context?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export default function AudioRecorder({ onTranscriptionComplete, disabled, context = [] }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load voices on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      window.speechSynthesis.getVoices();
      // Listen for voices changed event
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        window.speechSynthesis.getVoices();
      });
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('context', JSON.stringify(context));

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process audio');
      }

      const data = await response.json();
      onTranscriptionComplete(data.transcription, data.response);
      
      // Speak the response
      speakText(data.response);
    } catch (error) {
      console.error('Error processing audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process audio';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {isSpeaking && (
        <motion.button
          onClick={stopSpeaking}
          className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-xl shadow-red-500/50 ring-2 ring-red-400/50"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          title="Stop audio"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
        >
          <MicOff className="w-6 h-6 text-white" />
        </motion.button>
      )}
      
      <motion.button
        onClick={toggleRecording}
        disabled={disabled || isProcessing}
        className={`relative p-7 rounded-3xl transition-all duration-300 ${
          isRecording
            ? 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 hover:from-red-600 hover:via-rose-600 hover:to-pink-700 shadow-2xl shadow-red-500/60 ring-2 ring-red-400/50'
            : 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 shadow-2xl shadow-purple-500/60 ring-2 ring-purple-400/50'
        } ${(disabled || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={{ scale: 1.1, rotate: isRecording ? 0 : 10 }}
        whileTap={{ scale: 0.9 }}
        animate={isRecording ? { 
          boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.8)',
            '0 0 0 30px rgba(239, 68, 68, 0)',
          ],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={isRecording ? { 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9"
          >
            <div className="w-full h-full border-4 border-white border-t-transparent rounded-full" />
          </motion.div>
        ) : isRecording ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <MicOff className="w-9 h-9 text-white" />
          </motion.div>
        ) : (
          <Mic className="w-9 h-9 text-white" />
        )}
      </motion.button>
    </div>
  );
}
