import { ChatContextMessage } from '@/types';

export class ContextManager {
  private static readonly MAX_CONTEXT_MESSAGES = 5;
  private static readonly STORAGE_KEY = 'ai_chat_context';

  static getContext(): ChatContextMessage[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading context:', error);
      return [];
    }
  }

  static addMessage(role: 'user' | 'assistant', content: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const context = this.getContext();
      context.push({ role, content });
      
      // Keep only the last MAX_CONTEXT_MESSAGES
      const trimmedContext = context.slice(-this.MAX_CONTEXT_MESSAGES);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedContext));
    } catch (error) {
      console.error('Error saving context:', error);
    }
  }

  static clearContext(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing context:', error);
    }
  }

  static formatContextForPrompt(): string {
    const context = this.getContext();
    if (context.length === 0) return '';
    
    return context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  }
}
