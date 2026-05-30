import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/stores/systemStore';
import rabbitIcon from '@/assets/kindpng_582715.png';

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
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: 'radial-gradient(circle at center, #1a0b2e 0%, #0a0612 100%)',
          }}
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[120px]"
              animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-[120px]"
              animate={{ 
                x: [0, -50, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center gap-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.h1 
                className="text-8xl font-thin tracking-tighter text-white sm:text-9xl md:text-[11rem] leading-none"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {hours}
              </motion.h1>
              <motion.p 
                className="text-xl font-light tracking-[0.4em] text-white/40 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {dateStr}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 mt-48 flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          >
            <div className="group relative">
              <motion.div 
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 opacity-20 blur-md group-hover:opacity-40 transition duration-1000"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:border-white/40">
                <img 
                  src={rabbitIcon} 
                  alt="Profile" 
                  className="h-full w-full object-cover p-3 opacity-90 group-hover:opacity-100"
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <p className="text-xl font-medium tracking-tight text-white/90">Angelo Gaviria</p>
              <div className="h-[2px] w-12 rounded-full bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            </div>

            <motion.p
              className="mt-12 text-xs font-light tracking-[0.3em] text-white/30 uppercase"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Click or press any key to unlock
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
