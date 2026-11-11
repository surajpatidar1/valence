import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import Reveal from './Reveal';

const FAQS = [
  {
    q: 'What kind of businesses do you work with?',
    a: 'We work with startups and small to medium-sized businesses that want a strong online presence, a reliable app, or less manual work through automation and AI.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Every project is different, so we don’t use one-size-fits-all pricing. After a free consultation we send a fixed quote with a clear scope, so you know exactly what you are paying for.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'It depends on scope. A business website is usually measured in weeks, while apps and custom platforms take longer. Your proposal will include a timeline with clear milestones.',
  },
  {
    q: 'Can you work with our existing website, app or tools?',
    a: 'Yes. We can improve or extend what you already have, and connect it to the tools your team uses, such as your CRM, accounting software or email platform.',
  },
  {
    q: 'How do you handle data privacy in AI projects?',
    a: 'We design AI features with privacy in mind: we limit what data is sent to language models, use business-grade APIs, and can discuss private or self-hosted options where needed.',
  },
  {
    q: 'Do you offer support after launch?',
    a: 'Yes. We offer maintenance and support plans covering updates, monitoring and ongoing improvements, tailored to what your product needs.',
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className={`acc${open ? ' is-open' : ''}`}>
      <h3>
        <button className="acc__btn" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          {q}
          <span className="acc__icon" aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            className="acc__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="container faq__inner">
        <div>
          <Reveal as="p" className="eyebrow">FAQ</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>Common questions.</Reveal>
          <Reveal as="p" className="section__lead" delay={0.1}>
            Have a question that isn’t covered here? <a href="#contact" className="inline-link">Get in touch</a>.
          </Reveal>
        </div>
        <div className="accordion">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <Item {...f} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
