import { create } from 'zustand';
import type { DesktopIcon } from '@/types';

interface DesktopStore {
  icons: DesktopIcon[];
  startMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

const GRID = 90;

const defaultIcons: DesktopIcon[] = [
  { id: 'icon-about', appId: 'about', label: 'About Me', icon: 'notepad', x: 0, y: 0 },
  { id: 'icon-projects', appId: 'projects', label: 'Projects', icon: 'folder', x: 0, y: GRID },
  { id: 'icon-terminal', appId: 'terminal', label: 'Terminal', icon: 'terminal', x: 0, y: GRID * 2 },
  { id: 'icon-browser', appId: 'browser', label: 'Browser', icon: 'browser', x: 0, y: GRID * 3 },
];

export const useDesktopStore = create<DesktopStore>((set) => ({
  icons: defaultIcons,
  startMenuOpen: false,
  toggleStartMenu: () => set((s) => ({ startMenuOpen: !s.startMenuOpen })),
  closeStartMenu: () => set({ startMenuOpen: false }),
}));
