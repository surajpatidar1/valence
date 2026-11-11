import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Reveal from './Reveal';

const STEPS = [
  { t: 'Discover', d: 'We learn about your business, goals and users, then agree on scope, timeline and a clear, fixed quote.', m: 'Free consultation & proposal' },
  { t: 'Design', d: 'You review and approve wireframes and visual designs before any development begins, so there are no surprises.', m: 'Wireframes & UI design' },
  { t: 'Build', d: 'We develop in short cycles with regular demos, so you can see progress and give feedback early.', m: 'Development & testing' },
  { t: 'Launch & support', d: 'We deploy, hand over everything you need, and offer maintenance plans to keep your product improving.', m: 'Launch, handover & support' },
];

export default function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section className="section process" id="process">
      <div className="container process__inner">
        <div className="process__sticky">
          <Reveal as="p" className="eyebrow">How we work</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>A clear process from idea to launch.</Reveal>
          <Reveal as="p" className="section__lead" delay={0.1}>
            Every project follows the same four stages, with agreed milestones and regular updates along the way.
          </Reveal>
        </div>
        <ol className="steps" ref={ref}>
          <motion.span className="steps__line" style={{ scaleY }} aria-hidden="true" />
          {STEPS.map((s, i) => (
            <Reveal as="li" className="step" key={s.t} delay={0.05}>
              <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                <small>{s.m}</small>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
