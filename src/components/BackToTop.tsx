import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 900));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="to-top"
          aria-label="Back to top"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
