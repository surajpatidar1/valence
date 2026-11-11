import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const STOPS = ['Order placed', 'Details checked', 'Invoice sent', 'Team updated'];
const STEP_MS = 1400;
const HOLD_MS = 2400;

/** Walks through the stops one at a time, pauses at the end, then repeats. */
function useCycle(enabled: boolean) {
  const [step, setStep] = useState(-1);
  useEffect(() => {
    if (!enabled) return;
    const finished = step >= STOPS.length - 1;
    const id = window.setTimeout(
      () => setStep(finished ? 0 : step + 1),
      step === -1 ? 1000 : finished ? HOLD_MS : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [step, enabled]);
  return step;
}

export default function HeroExample({ ready }: { ready: boolean }) {
  const step = useCycle(ready);
  const progress = Math.max(0, step) / (STOPS.length - 1);
  const dur = step === 0 ? 0.3 : 1;

  return (
    <motion.figure
      className="example"
      initial={{ opacity: 0, y: 30 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <figcaption className="example__intro">
        <span>For example</span>
        <b>Order to invoice</b>
      </figcaption>

      <div className="example__track" aria-label={`Automated steps: ${STOPS.join(', ')}`}>
        <div className="example__line" aria-hidden="true">
          <motion.span className="example__fill" animate={{ scaleX: progress }} transition={{ duration: dur, ease: 'easeInOut' }} />
          <motion.span className="example__dot" animate={{ left: `${progress * 100}%` }} transition={{ duration: dur, ease: 'easeInOut' }} />
        </div>
        <ol className="example__stops">
          {STOPS.map((s, i) => (
            <li key={s} className={step >= i ? 'is-reached' : ''}>
              <span className="example__node" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ol>
      </div>

      <dl className="example__time">
        <div>
          <dt>Before</dt>
          <dd className="example__before">25 min by hand</dd>
        </div>
        <div>
          <dt>With Valance</dt>
          <dd className="example__after">4 seconds</dd>
        </div>
      </dl>
    </motion.figure>
  );
}
