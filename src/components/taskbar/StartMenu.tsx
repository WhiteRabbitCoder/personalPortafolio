import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Power } from 'lucide-react';
import { useDesktopStore } from '@/stores/desktopStore';
import { useWindowStore } from '@/stores/windowStore';
import { AppIcon } from '@/components/window/AppIcon';
import type { AppId } from '@/types';
import rabbitIcon from '@/assets/kindpng_582715.png';

const pinnedApps: { id: AppId; label: string; icon: string }[] = [
  { id: 'about', label: 'About Me', icon: 'notepad' },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'terminal', label: 'Terminal', icon: 'terminal' },
  { id: 'spotify', label: 'Spotify', icon: 'spotify' },
];

export function StartMenu() {
  const isOpen = useDesktopStore((s) => s.startMenuOpen);
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);
  const openWindow = useWindowStore((s) => s.openWindow);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current && !ref.current.contains(target) && !target.closest('[data-start-button]')) {
        closeStartMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, closeStartMenu]);

  const handleOpen = (appId: AppId) => {
    openWindow(appId);
    closeStartMenu();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          className="glass-heavy absolute bottom-[60px] left-1/2 z-[9990] w-[90vw] max-w-[540px] -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl shadow-black/50"
          initial={{ y: 20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search */}
          <div className="p-4 pb-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <Search size={14} className="text-white/30" />
              <input
                type="text"
                placeholder="Search apps, files, settings..."
                className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/25 outline-none"
              />
            </div>
          </div>

          {/* Pinned */}
          <div className="px-4 pb-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/60">Pinned</h3>
              <span className="text-[10px] text-white/30">All apps →</span>
            </div>
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-5">
              {pinnedApps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors hover:bg-white/8"
                  onClick={() => handleOpen(app.id)}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                    <AppIcon icon={app.icon} size={20} className="text-violet-300" />
                  </div>
                  <span className="text-[11px] text-white/70">{app.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="border-t border-white/5 px-4 py-3">
            <h3 className="mb-2 text-xs font-semibold text-white/60">Recommended</h3>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/5">
                <AppIcon icon="plant" size={16} className="text-green-400" />
                <div>
                  <p className="text-xs text-white/70">GossipGarden</p>
                  <p className="text-[10px] text-white/30">Plant care app</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/5">
                <AppIcon icon="microphone" size={16} className="text-blue-400" />
                <div>
                  <p className="text-xs text-white/70">Voice Agent</p>
                  <p className="text-[10px] text-white/30">Audio visualizer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-violet-500/10 border border-white/10">
                <img src={rabbitIcon} alt="Profile" className="h-full w-full object-cover p-1" />
              </div>
              <span className="text-xs text-white/60">Angelo Gaviria</span>
            </div>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/60">
              <Power size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
