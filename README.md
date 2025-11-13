# AI Voice Agent

An interactive AI assistant powered by Groq's Whisper and Llama models, featuring voice and text capabilities with beautiful animations.

## Features

- 🎤 **Voice Input**: Record audio messages that are transcribed using Groq's Whisper model
- 💬 **Text Chat**: Type messages for text-based conversations
- 🔊 **Audio Responses**: Listen to AI responses with text-to-speech
- 🧠 **Context Memory**: Remembers the last 5 messages for contextual conversations
- ✨ **Beautiful UI**: Modern, animated interface with Framer Motion
- 🎨 **Gradient Backgrounds**: Dynamic animated gradients
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Models**: 
  - Groq Whisper (audio transcription)
  - Groq Llama 3.3 70B (text generation)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Groq API key (get one from [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-voice-agent.git
cd ai-voice-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Text Input
- Type your message in the input field at the bottom
- Press Enter or click the Send button

### Voice Input
- Click the microphone button to start recording
- Speak your message
- Click again to stop recording
- The app will transcribe your speech and generate a response

### Additional Features
- **Clear Chat**: Click the trash icon to clear all messages
- **Repeat Response**: Click the speaker icon to hear the last AI response again

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `GROQ_API_KEY` environment variable in Vercel project settings
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js applications:
- Netlify
- Railway
- Render
- AWS Amplify
- etc.

Make sure to set the `GROQ_API_KEY` environment variable on your deployment platform.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for accessing Whisper and Llama models | Yes |

## Project Structure

```
ai-voice-agent/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Text chat API endpoint
│   │   └── transcribe/route.ts    # Audio transcription API endpoint
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── components/
│   ├── AudioRecorder.tsx          # Voice recording component
│   ├── MessageList.tsx            # Chat messages display
│   └── TextInput.tsx              # Text input component
├── lib/
│   ├── contextManager.ts          # Context storage management
│   └── groq.ts                    # Groq SDK configuration
├── types/
│   └── index.ts                   # TypeScript type definitions
└── .env.local                     # Environment variables (create this)
```

## Features in Detail

### Context Management
The app maintains a conversation context of the last 5 messages. This allows the AI to provide more relevant and contextual responses based on previous interactions.

### Audio Processing
- Uses browser's MediaRecorder API for audio capture
- Sends audio to Groq's Whisper model for transcription
- Automatically converts responses to speech using Web Speech API

### Responsive Design
- Mobile-friendly interface
- Smooth animations and transitions
- Glass morphism effects for modern UI

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Acknowledgments

- Groq for providing fast AI inference
- Next.js team for the amazing framework
- Framer Motion for smooth animations
