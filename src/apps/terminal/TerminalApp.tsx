import { useState, useRef, useEffect, useCallback } from 'react';

interface HistoryEntry {
  input: string;
  output: string | null;
}

const HELP_TEXT = `Available commands:
  help        Show this help message
  about       Display info about Angelo
  skills      List technical skills
  projects    List projects
  contact     Show contact info
  clear       Clear the terminal
  whoami      Display current user
  date        Show current date
  echo <msg>  Print a message
  neofetch    System information`;

const ABOUT_TEXT = `Angelo Gaviria — Full-Stack Developer & Creative Technologist
Building at the intersection of design, AI, and solid engineering.
Type 'skills' or 'projects' to learn more.`;

const SKILLS_TEXT = `Frontend:  React, Next.js, Flutter, Tailwind, Framer Motion
Backend:   Node.js, FastAPI, PostgreSQL, n8n
AI/ML:     LLMs, pgvector, ElevenLabs, Computer Vision
Mobile:    Flutter/Dart, Kotlin/Compose
Tools:     Git, Docker, Vercel, Linux`;

const PROJECTS_TEXT = `Projects:
  gossip-garden     Flutter + FastAPI plant care app with AI
  petcare-ops       AI operations center for veterinary clinic
  voice-agent       Audio-reactive voice agent (ElevenLabs)
  rabbit-launcher   AI-native Android launcher (Kotlin)
  finbot            Financial assistant bot (live on Vercel)
  poologico-game    Interactive TypeScript game
  telegram-bot      Multi-platform video downloader bot`;

const CONTACT_TEXT = `GitHub:  github.com/WhiteRabbitCoder
Email:   angelogaviriam@gmail.com`;

const NEOFETCH = `
  ██████╗ ██╗   ██╗   Angelo@Portfolio
  ██╔══██╗██║   ██║   ──────────────────
  ██████╔╝██║   ██║   OS: Windows 12 (Portfolio Edition)
  ██╔══██╗╚██╗ ██╔╝   Shell: portfolio-terminal v1.0
  ██║  ██║ ╚████╔╝    Stack: React 19 + Vite + TypeScript
  ╚═╝  ╚═╝  ╚═══╝     Theme: Dark Glassmorphic
                       WM: Custom Window Manager
                       Uptime: since you opened this tab`;

export function TerminalApp() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { input: '', output: 'Welcome to Angelo\'s Terminal. Type "help" for commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const execute = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const parts = trimmed.split(' ');
      const command = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');

      let output: string | null = null;

      switch (command) {
        case '':
          break;
        case 'help':
          output = HELP_TEXT;
          break;
        case 'about':
          output = ABOUT_TEXT;
          break;
        case 'skills':
          output = SKILLS_TEXT;
          break;
        case 'projects':
          output = PROJECTS_TEXT;
          break;
        case 'contact':
          output = CONTACT_TEXT;
          break;
        case 'neofetch':
          output = NEOFETCH;
          break;
        case 'whoami':
          output = 'angelo';
          break;
        case 'date':
          output = new Date().toString();
          break;
        case 'echo':
          output = args || '';
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        default:
          output = `bash: ${command}: command not found. Type 'help' for available commands.`;
      }

      setHistory((prev) => [...prev, { input: trimmed, output }]);
      if (trimmed) {
        setCmdHistory((prev) => [trimmed, ...prev]);
      }
      setHistoryIndex(-1);
      setInput('');
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      execute(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
        setHistoryIndex(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const next = historyIndex - 1;
        setHistoryIndex(next);
        setInput(cmdHistory[next]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      className="flex h-full flex-col bg-[rgba(8,4,16,0.85)] font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-3">
        {history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.input !== '' && (
              <div className="flex gap-1">
                <span className="text-violet-400">angelo@portfolio</span>
                <span className="text-white/30">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white/50">$</span>
                <span className="ml-1 text-white/80">{entry.input}</span>
              </div>
            )}
            {entry.output && (
              <pre className="whitespace-pre-wrap text-white/60">{entry.output}</pre>
            )}
          </div>
        ))}

        {/* Prompt */}
        <div className="flex items-center gap-1">
          <span className="text-violet-400">angelo@portfolio</span>
          <span className="text-white/30">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white/50">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-1 flex-1 bg-transparent text-white/90 caret-violet-400 outline-none"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
