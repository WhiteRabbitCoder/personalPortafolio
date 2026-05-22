import { create } from 'zustand';
import type { AppId, WindowState } from '@/types';

interface WindowStore {
  windows: WindowState[];
  nextZIndex: number;
  openWindow: (appId: AppId, meta?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  updateTitle: (id: string, title: string) => void;
  getWindow: (id: string) => WindowState | undefined;
}

const APP_DEFAULTS: Record<AppId, { title: string; icon: string; width: number; height: number; minWidth: number; minHeight: number }> = {
  about: { title: 'About Me — Notepad', icon: 'notepad', width: 720, height: 520, minWidth: 400, minHeight: 300 },
  projects: { title: 'Projects — Explorer', icon: 'folder', width: 900, height: 600, minWidth: 500, minHeight: 350 },
  terminal: { title: 'Terminal', icon: 'terminal', width: 780, height: 480, minWidth: 400, minHeight: 250 },
  browser: { title: 'Browser', icon: 'browser', width: 960, height: 640, minWidth: 500, minHeight: 350 },
  settings: { title: 'Settings', icon: 'settings', width: 700, height: 500, minWidth: 400, minHeight: 300 },
};

let windowCounter = 0;

function centerWindow(width: number, height: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const offset = (windowCounter % 5) * 30;
  return {
    x: Math.max(0, Math.floor((vw - width) / 2) + offset),
    y: Math.max(0, Math.floor((vh - height) / 2) + offset - 24),
  };
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZIndex: 100,

  openWindow: (appId, meta) => {
    const existing = get().windows.find(
      (w) => w.appId === appId && !meta?.allowMultiple
    );
    if (existing) {
      get().focusWindow(existing.id);
      if (existing.isMinimized) {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === existing.id ? { ...w, isMinimized: false } : w
          ),
        }));
      }
      return;
    }

    const defaults = APP_DEFAULTS[appId];
    const pos = centerWindow(defaults.width, defaults.height);
    const id = `${appId}-${++windowCounter}`;
    const zIndex = get().nextZIndex;

    set((s) => ({
      windows: [
        ...s.windows,
        {
          id,
          appId,
          ...defaults,
          ...pos,
          isMaximized: false,
          isMinimized: false,
          zIndex,
          meta,
        },
      ],
      nextZIndex: zIndex + 1,
    }));
  },

  closeWindow: (id) =>
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) =>
    set((s) => {
      const z = s.nextZIndex;
      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, zIndex: z, isMinimized: false } : w
        ),
        nextZIndex: z + 1,
      };
    }),

  minimizeWindow: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
    })),

  toggleMaximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    })),

  updatePosition: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  updateSize: (id, width, height) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    })),

  updateTitle: (id, title) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, title } : w)),
    })),

  getWindow: (id) => get().windows.find((w) => w.id === id),
}));
