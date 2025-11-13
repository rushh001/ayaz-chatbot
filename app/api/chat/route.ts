import { groq } from '@/lib/groq';
import { ChatContextMessage } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { message, context = [] }: { message: string; context: ChatContextMessage[] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message provided' },
        { status: 400 }
      );
    }

    // Generate response using Llama with provided context
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful, knowledgeable AI assistant. Answer questions directly and provide detailed, informative responses. Be conversational and friendly. When asked about yourself or your capabilities, explain that you are powered by Groq\'s Llama 3.3 70B model.',
        },
        ...context.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return NextResponse.json({
      response: assistantResponse,
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
