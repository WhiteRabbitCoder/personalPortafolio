import { useCallback, useRef } from 'react';

interface UseDragOptions {
  onDragStart?: () => void;
  onDrag: (x: number, y: number) => void;
  onDragEnd?: () => void;
}

export function useDrag({ onDragStart, onDrag, onDragEnd }: UseDragOptions) {
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, currentX: number, currentY: number) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { x: currentX, y: currentY };
      onDragStart?.();

      const handlePointerMove = (ev: PointerEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - startMouse.current.x;
        const dy = ev.clientY - startMouse.current.y;
        onDrag(startPos.current.x + dx, startPos.current.y + dy);
      };

      const handlePointerUp = () => {
        dragging.current = false;
        onDragEnd?.();
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [onDrag, onDragStart, onDragEnd]
  );

  return { handlePointerDown };
}
