import { AppIcon } from '@/components/window/AppIcon';
import { useWindowStore } from '@/stores/windowStore';
import type { DesktopIcon as DesktopIconType } from '@/types';

interface Props {
  icon: DesktopIconType;
}

export function DesktopIcon({ icon }: Props) {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <button
      className="flex w-[76px] flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-white/8 active:bg-white/12 focus:bg-[var(--color-accent-soft)] focus:outline-none"
      onDoubleClick={() => openWindow(icon.appId)}
      tabIndex={0}
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <AppIcon icon={icon.icon} size={32} className="text-white/80" />
      </div>
      <span className="w-full text-center text-[11px] leading-tight text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {icon.label}
      </span>
    </button>
  );
}
