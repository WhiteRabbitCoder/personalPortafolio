import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/stores/systemStore';

export function LockScreen() {
  const bootPhase = useSystemStore((s) => s.bootPhase);
  const setBootPhase = useSystemStore((s) => s.setBootPhase);
  const currentTime = useSystemStore((s) => s.currentTime);
  const tickClock = useSystemStore((s) => s.tickClock);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(tickClock, 1000);
    return () => clearInterval(interval);
  }, [tickClock]);

  const unlock = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => setBootPhase('desktop'), 600);
  }, [exiting, setBootPhase]);

  useEffect(() => {
    if (bootPhase !== 'lock') return;
    const handler = (e: KeyboardEvent | MouseEvent) => {
      if (e.type === 'keydown' || e.type === 'click') unlock();
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [bootPhase, unlock]);

  const hours = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AnimatePresence>
      {bootPhase === 'lock' && (
        <motion.div
          key="lock"
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(88, 28, 135, 0.4), rgba(10, 6, 18, 0.98) 70%)',
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-7xl font-light tracking-tight text-white sm:text-8xl">
              {hours}
            </h1>
            <p className="text-lg font-light text-white/70">{dateStr}</p>
          </motion.div>

          <motion.div
            className="mt-16 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
              <span className="text-lg font-semibold text-white">AG</span>
            </div>
            <p className="text-sm font-medium text-white/90">Angelo Gaviria</p>
            <motion.p
              className="mt-2 text-xs text-white/40"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Click or press any key to unlock
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
