import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import { HAS_PROJECTS, PROJECTS, type Category, type Project } from '../data/projects';

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

function Card({ p }: { p: Project }) {
  const Wrapper = p.url ? 'a' : 'div';
  return (
    <motion.article
      layout
      className="work-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
  const [filter, setFilter] = useState<'All' | Category>('All');
  const categories = useMemo(() => Array.from(new Set(PROJECTS.map((p) => p.category))), []);
  const list = PROJECTS.filter((p) => filter === 'All' || p.category === filter);

  if (!HAS_PROJECTS) return null;

  return (
    <section className="section work" id="work">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <Reveal as="p" className="eyebrow">Our work</Reveal>
            <Reveal as="h2" className="section__title" delay={0.05}>Selected projects.</Reveal>
          </div>
          {categories.length > 1 && (
            <Reveal className="filters" role="group" aria-label="Filter projects">
              {(['All', ...categories] as const).map((c) => (
                <button key={c} className={`filter${filter === c ? ' is-active' : ''}`} aria-pressed={filter === c} onClick={() => setFilter(c)}>
                  {filter === c && <motion.span layoutId="work-filter" className="filter__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="filter__label">{c === 'All' ? 'All' : LABELS[c]}</span>
                </button>
              ))}
            </Reveal>
          )}
        </div>

        <motion.div layout className="work-grid">
          <AnimatePresence mode="popLayout">
            {list.map((p) => <Card key={p.title} p={p} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
