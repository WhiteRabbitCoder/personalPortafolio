import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'gossip-garden',
    name: 'GossipGarden',
    description:
      'Full-stack plant care app with AI — Flutter mobile + FastAPI backend. Helps you connect with your plants through computer vision and natural language.',
    stack: ['Flutter', 'Dart', 'FastAPI', 'Python', 'AI/ML'],
    url: 'https://github.com/WhiteRabbitCoder/GossipGarden',
    icon: 'plant',
  },
  {
    id: 'gossip-garden-landing',
    name: 'GossipGarden Landing',
    description:
      'Marketing site for GossipGarden. Hand-drawn crayon design system with scroll-driven animations. Built with React 18 + in-browser JSX.',
    stack: ['React', 'JavaScript', 'CSS Animations'],
    url: 'https://github.com/WhiteRabbitCoder/LandingGossipGarden',
    icon: 'web',
  },
  {
    id: 'petcare-ops',
    name: 'PetCare Ops',
    description:
      'Multi-channel AI operations center for a veterinary clinic. Integrates n8n workflows, pgvector for semantic search, and a Next.js dashboard.',
    stack: ['Next.js', 'n8n', 'pgvector', 'PostgreSQL', 'AI'],
    url: 'https://github.com/WhiteRabbitCoder/petcare-ops',
    icon: 'health',
  },
  {
    id: 'voice-agent',
    name: 'Voice Agent Visualizer',
    description:
      'Minimalist voice agent interface with audio-reactive blob visualization. Built with Vite and the ElevenLabs Conversational AI SDK.',
    stack: ['Vite', 'JavaScript', 'ElevenLabs SDK', 'Web Audio API'],
    url: 'https://github.com/WhiteRabbitCoder/voice-agent-visualizer',
    icon: 'microphone',
  },
  {
    id: 'rabbit-launcher',
    name: 'Rabbit Minimal Launcher',
    description:
      'Experimental AI-native Android launcher focused on intentional use and digital wellbeing. Built with Jetpack Compose.',
    stack: ['Kotlin', 'Jetpack Compose', 'Android', 'AI'],
    url: 'https://github.com/WhiteRabbitCoder/Rabbit-Minimal-Android',
    icon: 'phone',
  },
  {
    id: 'finbot',
    name: 'Finbot',
    description:
      'Financial assistant bot with a live dashboard. Deployed on Vercel.',
    stack: ['TypeScript', 'React', 'Vercel'],
    url: 'https://github.com/WhiteRabbitCoder/Finbot-Prueba',
    homepage: 'https://finbot-simulacro.vercel.app',
    icon: 'chart',
  },
  {
    id: 'poologico-game',
    name: 'Poológico Game',
    description:
      'Interactive TypeScript game built as a creative coding experiment.',
    stack: ['TypeScript', 'Canvas/WebGL'],
    url: 'https://github.com/WhiteRabbitCoder/PoologicoGame',
    icon: 'game',
  },
  {
    id: 'telegram-bot',
    name: 'Video Downloader Bot',
    description:
      'Telegram bot that downloads videos from YouTube, Instagram, Twitter/X, TikTok, Facebook and 1000+ platforms.',
    stack: ['Python', 'Telegram API', 'yt-dlp'],
    url: 'https://github.com/WhiteRabbitCoder/telegram-video-downloader-bot',
    icon: 'bot',
  },
];
