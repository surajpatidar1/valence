import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Reveal from './Reveal';
import { HAS_PROJECTS, PROJECTS, type Category, type Project } from '../data/projects';

/** Projects shown per page (2 × 2 grid on desktop). */
const PAGE_SIZE = 4;

const LABELS: Record<Category, string> = {
  Web: 'Web',
  App: 'Mobile app',
  SEO: 'SEO',
  Automation: 'Automation',
  AI: 'LLM / AI',
};

/** Neutral device mockup used when a project has no screenshot yet. */
function Mockup({ p }: { p: Project }) {
  if (p.category === 'App') {
    return (
      <div className="mock mock--phone" aria-hidden="true">
        <div className="mock__phone">
          <span className="mock__notch" />
          <span className="mock__line mock__line--lg" />
          <span className="mock__line" />
          <span className="mock__block" />
          <span className="mock__line mock__line--sm" />
          <span className="mock__block mock__block--sm" />
        </div>
      </div>
    );
  }
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock__browser">
        <div className="mock__bar"><i /><i /><i /></div>
        <div className="mock__page">
          <span className="mock__line mock__line--lg" />
          <span className="mock__line" />
          <div className="mock__cols"><span /><span /><span /></div>
        </div>
      </div>
    </div>
  );
}

function Card({ p, i }: { p: Project; i: number }) {
  const Wrapper = p.url ? 'a' : 'div';
  return (
    <motion.article
      className="work-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Wrapper
        className="work-card__inner"
        {...(p.url ? { href: p.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <div className="work-card__media">
          {p.image ? <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" decoding="async" /> : <Mockup p={p} />}
          {p.sample && <span className="work-card__sample">Sample</span>}
        </div>
        <div className="work-card__body">
          <p className="work-card__meta">
            {LABELS[p.category]} · {p.year}
            {p.client && <> · {p.client}</>}
          </p>
          <h3>
            {p.title}
            {p.url && <span className="work-card__arrow" aria-hidden="true">↗</span>}
          </h3>
          <p className="work-card__summary">{p.summary}</p>
          <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </Wrapper>
    </motion.article>
  );
}

export default function Portfolio() {
  const [page, setPage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  if (!HAS_PROJECTS) return null;

  const pages = Math.ceil(PROJECTS.length / PAGE_SIZE);
  const items = PROJECTS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const goTo = (p: number) => {
    if (p < 0 || p >= pages || p === page) return;
    setPage(p);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section work" id="work" ref={sectionRef}>
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">Our work</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>Selected projects.</Reveal>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            className="work-grid"
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
          >
            {items.map((p, i) => <Card key={p.title} p={p} i={i} />)}
          </motion.div>
        </AnimatePresence>

        {pages > 1 && (
          <nav className="pager" aria-label="Projects pages">
            <button className="pager__btn" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label="Previous page">
              ←
            </button>
            <ol className="pager__pages">
              {Array.from({ length: pages }, (_, i) => (
                <li key={i}>
                  <button
                    className={`pager__num${i === page ? ' is-active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={i === page ? 'page' : undefined}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ol>
            <button className="pager__btn" onClick={() => goTo(page + 1)} disabled={page === pages - 1} aria-label="Next page">
              →
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
