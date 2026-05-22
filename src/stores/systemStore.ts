import { create } from 'zustand';
import type { BootPhase } from '@/types';

interface SystemState {
  bootPhase: BootPhase;
  currentTime: Date;
  setBootPhase: (phase: BootPhase) => void;
  tickClock: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  bootPhase: 'loading',
  currentTime: new Date(),
  setBootPhase: (phase) => set({ bootPhase: phase }),
  tickClock: () => set({ currentTime: new Date() }),
}));
