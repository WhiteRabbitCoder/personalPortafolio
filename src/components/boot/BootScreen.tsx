import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/stores/systemStore';

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0612]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute h-16 w-16 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 opacity-80" />
              <span className="relative text-2xl font-bold text-white">AG</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center gap-4"
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
