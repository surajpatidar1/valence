import { useEffect, useRef } from 'react';

const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Subtly pulls an element toward the cursor on hover (desktop only). */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return ref;
}
