import { useCallback, useRef } from 'react';

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

interface UseResizeOptions {
  onResize: (x: number, y: number, w: number, h: number) => void;
  minWidth: number;
  minHeight: number;
}

export function useResize({ onResize, minWidth, minHeight }: UseResizeOptions) {
  const startMouse = useRef({ x: 0, y: 0 });
  const startRect = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleResizeStart = useCallback(
    (
      e: React.PointerEvent,
      edge: Edge,
      currentX: number,
      currentY: number,
      currentW: number,
      currentH: number
    ) => {
      e.preventDefault();
      e.stopPropagation();
      startMouse.current = { x: e.clientX, y: e.clientY };
      startRect.current = { x: currentX, y: currentY, w: currentW, h: currentH };

      const handlePointerMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startMouse.current.x;
        const dy = ev.clientY - startMouse.current.y;
        const r = startRect.current;

        let nx = r.x;
        let ny = r.y;
        let nw = r.w;
        let nh = r.h;

        if (edge.includes('e')) nw = Math.max(minWidth, r.w + dx);
        if (edge.includes('s')) nh = Math.max(minHeight, r.h + dy);
        if (edge.includes('w')) {
          nw = Math.max(minWidth, r.w - dx);
          if (nw > minWidth) nx = r.x + dx;
        }
        if (edge.includes('n')) {
          nh = Math.max(minHeight, r.h - dy);
          if (nh > minHeight) ny = r.y + dy;
        }

        onResize(nx, ny, nw, nh);
      };

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [onResize, minWidth, minHeight]
  );

  return { handleResizeStart };
}

export const EDGES: { edge: Edge; className: string }[] = [
  { edge: 'n', className: 'absolute -top-1 left-2 right-2 h-2 cursor-n-resize' },
  { edge: 's', className: 'absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize' },
  { edge: 'e', className: 'absolute -right-1 top-2 bottom-2 w-2 cursor-e-resize' },
  { edge: 'w', className: 'absolute -left-1 top-2 bottom-2 w-2 cursor-w-resize' },
  { edge: 'ne', className: 'absolute -top-1 -right-1 h-3 w-3 cursor-ne-resize' },
  { edge: 'nw', className: 'absolute -top-1 -left-1 h-3 w-3 cursor-nw-resize' },
  { edge: 'se', className: 'absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize' },
  { edge: 'sw', className: 'absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize' },
];
