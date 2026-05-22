import { aboutText } from '@/data/about';

export function AboutApp() {
  return (
    <div className="flex h-full flex-col bg-[rgba(12,8,24,0.6)]">
      {/* Menu bar */}
      <div className="flex h-7 shrink-0 items-center gap-4 border-b border-white/5 px-3">
        {['File', 'Edit', 'Format', 'View', 'Help'].map((item) => (
          <span key={item} className="text-[11px] text-white/50 hover:text-white/70 cursor-default">
            {item}
          </span>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-white/80">
          {aboutText}
        </pre>
      </div>
      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center justify-between border-t border-white/5 px-3">
        <span className="text-[10px] text-white/30">Ln 1, Col 1</span>
        <span className="text-[10px] text-white/30">UTF-8</span>
      </div>
    </div>
  );
}
