import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number>();

  const show = useCallback((m: string) => {
    setMsg(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMsg(null), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence>
          {msg && (
            <motion.div
              className="toast"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              {msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
