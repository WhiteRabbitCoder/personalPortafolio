import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Globe } from 'lucide-react';
import type { WindowState } from '@/types';

interface BrowserAppProps {
  window: WindowState;
}

const DEFAULT_URL = 'https://github.com/WhiteRabbitCoder';

export function BrowserApp({ window: win }: BrowserAppProps) {
  const initialUrl = (win.meta?.url as string) || DEFAULT_URL;
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [key, setKey] = useState(0);

  const navigate = (newUrl: string) => {
    let final = newUrl;
    if (!final.startsWith('http://') && !final.startsWith('https://')) {
      final = 'https://' + final;
    }
    setUrl(final);
    setInputUrl(final);
    setKey((k) => k + 1);
  };

  return (
    <div className="flex h-full flex-col bg-[rgba(12,8,24,0.6)]">
      {/* Toolbar */}
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-white/5 px-2">
        <button className="flex h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/5 hover:text-white/60">
          <ArrowLeft size={14} />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/5 hover:text-white/60">
          <ArrowRight size={14} />
        </button>
        <button
          className="flex h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/5 hover:text-white/60"
          onClick={() => setKey((k) => k + 1)}
        >
          <RotateCw size={13} />
        </button>

        <form
          className="flex flex-1 items-center gap-1.5 rounded-md bg-white/5 px-2 py-1"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(inputUrl);
          }}
        >
          <Globe size={12} className="shrink-0 text-white/30" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-transparent text-[11px] text-white/70 outline-none"
            spellCheck={false}
          />
        </form>
      </div>

      {/* iframe */}
      <div className="relative flex-1">
        <iframe
          key={key}
          src={url}
          className="h-full w-full border-0 bg-white"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          title="Browser"
        />
      </div>
    </div>
  );
}
