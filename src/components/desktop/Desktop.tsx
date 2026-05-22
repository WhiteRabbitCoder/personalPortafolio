import { useDesktopStore } from '@/stores/desktopStore';
import { useWindowStore } from '@/stores/windowStore';
import { Window } from '@/components/window/Window';
import { DesktopIcon } from './DesktopIcon';
import { AboutApp } from '@/apps/about/AboutApp';
import { ProjectsApp } from '@/apps/projects/ProjectsApp';
import { TerminalApp } from '@/apps/terminal/TerminalApp';
import { SpotifyApp } from '@/apps/spotify/SpotifyApp';
import type { WindowState } from '@/types';

function renderApp(win: WindowState) {
  switch (win.appId) {
    case 'about':
      return <AboutApp />;
    case 'projects':
      return <ProjectsApp />;
    case 'terminal':
      return <TerminalApp />;
    case 'spotify':
      return <SpotifyApp />;
    default:
      return <div className="flex h-full items-center justify-center text-white/30">App not found</div>;
  }
}

export function Desktop() {
  const icons = useDesktopStore((s) => s.icons);
  const closeStartMenu = useDesktopStore((s) => s.closeStartMenu);
  const windows = useWindowStore((s) => s.windows);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 30% 20%, rgba(88, 28, 135, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(30, 58, 138, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(15, 10, 30, 1) 0%, rgba(10, 6, 18, 1) 100%)',
      }}
      onClick={() => closeStartMenu()}
    >
      {/* Desktop icons */}
      <div className="absolute left-4 top-4 flex flex-col gap-1">
        {icons.map((icon) => (
          <DesktopIcon key={icon.id} icon={icon} />
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {renderApp(win)}
        </Window>
      ))}
    </div>
  );
}
