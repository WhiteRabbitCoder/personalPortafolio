import { useEffect } from 'react';
import { Wifi, Volume2, BatteryMedium } from 'lucide-react';
import { useDesktopStore } from '@/stores/desktopStore';
import { useWindowStore } from '@/stores/windowStore';
import { useSystemStore } from '@/stores/systemStore';
import { AppIcon } from '@/components/window/AppIcon';
import { StartMenu } from './StartMenu';
import rabbitIcon from '@/assets/kindpng_582715.png';

const taskbarApps = [
  { appId: 'about' as const, icon: 'notepad' },
  { appId: 'projects' as const, icon: 'folder' },
  { appId: 'terminal' as const, icon: 'terminal' },
  { appId: 'spotify' as const, icon: 'spotify' },
];

export function Taskbar() {
  const toggleStartMenu = useDesktopStore((s) => s.toggleStartMenu);
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const currentTime = useSystemStore((s) => s.currentTime);
  const tickClock = useSystemStore((s) => s.tickClock);

  useEffect(() => {
    const interval = setInterval(tickClock, 1000);
    return () => clearInterval(interval);
  }, [tickClock]);

  const hours = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateStr = currentTime.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAppClick = (appId: typeof taskbarApps[number]['appId']) => {
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        focusWindow(existing.id);
      } else {
        const isTopWindow =
          existing.zIndex === Math.max(...windows.map((w) => w.zIndex));
        if (isTopWindow) {
          minimizeWindow(existing.id);
        } else {
          focusWindow(existing.id);
        }
      }
    } else {
      openWindow(appId);
    }
  };

  return (
    <>
      <StartMenu />
      <div className="absolute bottom-2 left-1/2 z-[9995] -translate-x-1/2">
        <div className="glass flex h-11 items-center gap-0.5 rounded-2xl px-1.5 shadow-lg shadow-black/30">
          {/* Start button */}
          <button
            data-start-button
            className="group flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-90"
            onClick={(e) => {
              e.stopPropagation();
              toggleStartMenu();
            }}
          >
            <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded bg-white/5 border border-white/10 transition-transform group-hover:scale-110">
              <img src={rabbitIcon} alt="Start" className="h-full w-full object-contain p-0.5" />
            </div>
          </button>

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* App icons */}
          {taskbarApps.map(({ appId, icon }) => {
            const isOpen = windows.some((w) => w.appId === appId);
            return (
              <button
                key={appId}
                className={`relative flex h-8 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/10 ${
                  isOpen ? 'text-white/90' : 'text-white/45'
                }`}
                onClick={() => handleAppClick(appId)}
              >
                <AppIcon icon={icon} size={17} />
                {isOpen && (
                  <div className="absolute -bottom-0.5 left-1/2 h-[3px] w-3 -translate-x-1/2 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="mx-1 h-5 w-px bg-white/10" />

          {/* System tray */}
          <div className="flex items-center gap-1.5 px-1.5">
            <div className="flex items-center gap-1 text-white/35">
              <Wifi size={13} />
              <Volume2 size={13} />
              <BatteryMedium size={13} />
            </div>
            <div className="flex flex-col items-end pl-1">
              <span className="text-[10px] leading-tight text-white/60">{hours}</span>
              <span className="text-[10px] leading-tight text-white/40">{dateStr}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
