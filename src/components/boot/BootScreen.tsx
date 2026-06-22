import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/stores/systemStore';
import rabbitIcon from '@/assets/kindpng_582715.png';

export function BootScreen() {
  const bootPhase = useSystemStore((s) => s.bootPhase);
  const setBootPhase = useSystemStore((s) => s.setBootPhase);

  useEffect(() => {
    if (bootPhase === 'loading') {
      const timer = setTimeout(() => setBootPhase('lock'), 2400);
      return () => clearTimeout(timer);
    }
  }, [bootPhase, setBootPhase]);

  return (
    <AnimatePresence>
      {bootPhase === 'loading' && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0612]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon — anchored at 38% from top */}
          <motion.div
            className="absolute top-[38%] -translate-y-1/2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 opacity-30 blur-md" />
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5">
                <img src={rabbitIcon} alt="AG" className="h-full w-full object-cover p-2 opacity-90" />
              </div>
            </div>
          </motion.div>

          {/* Loading bar — anchored at 68% from top */}
          <motion.div
            className="absolute top-[68%] -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="h-0.5 w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
