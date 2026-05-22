export type AppId =
  | 'about'
  | 'projects'
  | 'terminal'
  | 'spotify'
  | 'settings';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  meta?: Record<string, unknown>;
}

export interface DesktopIcon {
  id: string;
  appId: AppId;
  label: string;
  icon: string;
  x: number;
  y: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  url: string;
  homepage?: string;
  icon: string;
}

export type BootPhase = 'loading' | 'lock' | 'desktop';
