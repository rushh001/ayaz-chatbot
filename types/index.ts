export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isAudio?: boolean;
}

export interface ChatContextMessage {
  role: 'user' | 'assistant';
  content: string;
}
