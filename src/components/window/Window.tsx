import { type ReactNode, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { useWindowStore } from '@/stores/windowStore';
import { useDrag } from '@/hooks/useDrag';
import { useResize, EDGES } from '@/hooks/useResize';
import { AppIcon } from './AppIcon';
import type { WindowState } from '@/types';

interface WindowProps {
  window: WindowState;
  children: ReactNode;
}

export function Window({ window: win, children }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, updatePosition, updateSize } =
    useWindowStore();

  const [isDragging, setIsDragging] = useState(false);
  const preMaxRef = useRef({ x: win.x, y: win.y, w: win.width, h: win.height });

  const handleDrag = useCallback(
    (x: number, y: number) => {
      if (win.isMaximized) {
        toggleMaximize(win.id);
        const halfW = preMaxRef.current.w / 2;
        updatePosition(win.id, x - halfW, y);
        return;
      }
      updatePosition(win.id, x, y);
    },
    [win.id, win.isMaximized, toggleMaximize, updatePosition]
  );

  const { handlePointerDown } = useDrag({
    onDragStart: () => {
      setIsDragging(true);
      focusWindow(win.id);
      if (!win.isMaximized) {
        preMaxRef.current = { x: win.x, y: win.y, w: win.width, h: win.height };
      }
    },
    onDrag: handleDrag,
    onDragEnd: () => setIsDragging(false),
  });

  const handleResize = useCallback(
    (x: number, y: number, w: number, h: number) => {
      updatePosition(win.id, x, y);
      updateSize(win.id, w, h);
    },
    [win.id, updatePosition, updateSize]
  );

  const { handleResizeStart } = useResize({
    onResize: handleResize,
    minWidth: win.minWidth,
    minHeight: win.minHeight,
  });

  const style: React.CSSProperties = win.isMaximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 56px)', zIndex: win.zIndex }
    : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          key={win.id}
          className="absolute flex flex-col overflow-hidden rounded-xl shadow-2xl shadow-black/40"
          style={{
            ...style,
            contain: 'layout paint',
            willChange: isDragging ? 'transform' : 'auto',
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.15 }}
          onPointerDown={() => focusWindow(win.id)}
        >
          <div className="glass-heavy flex h-full flex-col rounded-xl">
            {/* Title bar */}
            <div
              className="flex h-9 shrink-0 items-center justify-between px-3"
              onPointerDown={(e) => handlePointerDown(e, win.x, win.y)}
              onDoubleClick={() => toggleMaximize(win.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <AppIcon icon={win.icon} size={14} className="shrink-0 text-white/60" />
                <span className="truncate text-xs text-white/70">{win.title}</span>
              </div>
              <div className="flex items-center">
                <button
                  className="flex h-7 w-10 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(win.id);
                  }}
                >
                  <Minus size={14} />
                </button>
                <button
                  className="flex h-7 w-10 items-center justify-center rounded text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMaximize(win.id);
                  }}
                >
                  <Square size={11} />
                </button>
                <button
                  className="flex h-7 w-10 items-center justify-center rounded text-white/50 transition-colors hover:bg-[var(--color-window-close)] hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(win.id);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative min-h-0 flex-1 overflow-auto">
              {children}
            </div>
          </div>

          {/* Resize handles */}
          {!win.isMaximized &&
            EDGES.map(({ edge, className }) => (
              <div
                key={edge}
                className={className}
                onPointerDown={(e) =>
                  handleResizeStart(e, edge, win.x, win.y, win.width, win.height)
                }
              />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
