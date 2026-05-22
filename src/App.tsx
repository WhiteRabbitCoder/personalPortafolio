import { useSystemStore } from '@/stores/systemStore';
import { BootScreen } from '@/components/boot/BootScreen';
import { LockScreen } from '@/components/boot/LockScreen';
import { Desktop } from '@/components/desktop/Desktop';
import { Taskbar } from '@/components/taskbar/Taskbar';

export default function App() {
  const bootPhase = useSystemStore((s) => s.bootPhase);

  return (
    <div className="h-full w-full">
      <BootScreen />
      <LockScreen />

      {bootPhase === 'desktop' && (
        <div className="flex h-full w-full flex-col">
          <div className="relative min-h-0 flex-1">
            <Desktop />
          </div>
          <Taskbar />
        </div>
      )}
    </div>
  );
}
