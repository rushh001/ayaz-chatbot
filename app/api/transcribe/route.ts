import { groq } from '@/lib/groq';
import { ChatContextMessage } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const contextStr = formData.get('context') as string;
    
    let context: ChatContextMessage[] = [];
    if (contextStr) {
      try {
        context = JSON.parse(contextStr);
      } catch (e) {
        console.warn('Failed to parse context:', e);
      }
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert audio file to transcription using Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      response_format: 'json',
      language: 'en',
    });

    const transcribedText = transcription.text;

    // Generate response using Llama
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful, knowledgeable AI assistant. Answer questions directly and provide detailed, informative responses. Be conversational and friendly. Keep your answers informative but brief enough to be spoken aloud. When asked about yourself or your capabilities, explain that you are powered by Groq\'s Llama 3.3 70B model with Whisper for audio transcription.',
        },
        ...context.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: transcribedText,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

    return NextResponse.json({
      transcription: transcribedText,
      response: assistantResponse,
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process audio';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
