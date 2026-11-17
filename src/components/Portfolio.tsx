import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import { API_BASE } from '../config';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  client?: string | null;
  year?: string | null;
  summary: string;
  solution?: string | null;
  metric?: string | null;
  tags: string[];
  image?: string | null;
  url?: string | null;
  isFeatured: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  order: number;
  createdAt: string;
}

function CardMockup({ type, image }: { type: string; image?: string | null }) {
  if (image) {
    return (
      <div className="proof-mock-img" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <img
          src={image}
          alt=""
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  if (type === 'Automation') {
    return (
      <div className="proof-mock" aria-hidden="true">
        <div className="proof-mock__nodes">
          <div className="proof-mock__node proof-mock__node--active">
            <span>Webhook</span>
          </div>
          <div className="proof-mock__connector" />
          <div className="proof-mock__node proof-mock__node--active">
            <span>Transform</span>
          </div>
          <div className="proof-mock__connector" />
          <div className="proof-mock__node">
            <span>Sync ERP</span>
          </div>
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

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/portfolio/published`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.portfolios)) {
          setProjects(data.portfolios);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const hasProjects = projects.length > 0;

  return (
    <section className="section work" id="work" aria-label="Portfolio & Case Studies">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow eyebrow--no-counter">Work</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>
            Proven results, built to last.
          </Reveal>
          <Reveal as="p" className="section__lead" delay={0.1}>
            A sample of systems and software we engineer to eliminate repetitive manual work and drive measurable commercial outcomes.
          </Reveal>
        </div>

        {hasProjects ? (
          <div className="case-grid">
            {projects.map((p, i) => (
              <motion.article
                key={p.id}
                className="case-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="case-card__media">
                  <CardMockup type={p.category} image={p.image} />
                  {p.isFeatured && <span className="case-card__badge">Featured</span>}
                </div>

                <div className="case-card__body">
                  <div className="case-card__header">
                    <div>
                      <h3 className="case-card__title">{p.title}</h3>
                      {p.client && (
                        <span style={{ fontSize: 13, color: '#716c60', display: 'block', marginTop: 2 }}>
                          Client: {p.client} {p.year ? `(${p.year})` : ''}
                        </span>
                      )}
                    </div>
                    <span className="case-card__cat">{p.category}</span>
                  </div>

                  <dl className="case-card__details">
                    <div className="case-card__item">
                      <dt>Problem</dt>
                      <dd>{p.summary}</dd>
                    </div>

                    {p.solution && (
                      <div className="case-card__item">
                        <dt>Solution</dt>
                        <dd>{p.solution}</dd>
                      </div>
                    )}

                    {p.metric && (
                      <div className="case-card__item case-card__item--metric">
                        <dt>Result metric</dt>
                        <dd className="case-card__metric-val">{p.metric}</dd>
                      </div>
                    )}
                  </dl>

                  {p.tags && p.tags.length > 0 && (
                    <div className="case-card__footer">
                      <span className="case-card__tools-label">Tools used:</span>
                      <ul className="tags">
                        {p.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.url && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #e5d6bf' }}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: '#173d32',
                          textDecoration: 'underline',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        Visit live project ↗
                      </a>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : loaded ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f7f2ea', borderRadius: 12, border: '1px solid #e5d6bf', marginTop: 20 }}>
            <p style={{ margin: 0, fontSize: 16, color: '#102b23', fontWeight: 600 }}>
              Recent case studies are currently being curated.
            </p>
            <p style={{ margin: '8px 0 20px', fontSize: 13, color: '#716c60' }}>
              Publish projects directly from the Admin Panel to display them live in this section.
            </p>
            <a href="/#contact" className="btn btn--primary" style={{ display: 'inline-flex', padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>
              Start a project with Valance →
            </a>
          </div>
        ) : null}

        {hasProjects && (
          <Reveal className="work__coming-soon" delay={0.2}>
            <p>More case studies added regularly via the Admin Panel.</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
