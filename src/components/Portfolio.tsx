import { motion } from 'framer-motion';
import Reveal from './Reveal';

interface CaseStudy {
  id: string;
  isDemo?: boolean;
  title: string;
  problem: string;
  solution: string;
  metric: string;
  tools: string[];
  category: 'Automation' | 'Web' | 'App';
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    isDemo: true,
    title: '[CASE STUDY 1]',
    problem: 'Manual multi-step order entry and verification delayed customer fulfillments and created inventory discrepancies.',
    solution: 'Designed an automated event-driven sync pipeline linking e-commerce checkouts directly to ERP, invoicing, and logistics.',
    metric: '85% decrease in manual processing time with zero sync errors',
    tools: ['n8n', 'Node.js', 'PostgreSQL', 'Webhooks', 'REST APIs'],
    category: 'Automation',
  },
  {
    id: 'case-2',
    isDemo: false,
    title: '[CASE STUDY 2]',
    problem: 'Client appointments and quotes required protracted back-and-forth emails, causing high lead drop-off.',
    solution: 'Engineered a modern self-service booking and customer intake portal with instant calendar validation and automated reminders.',
    metric: '3.5x faster customer onboarding with 40% higher booking completion',
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    category: 'Web',
  },
];

function CardMockup({ type }: { type: 'Automation' | 'Web' }) {
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
  return (
    <section className="section work" id="work">
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

        <div className="case-grid">
          {CASE_STUDIES.map((cs, i) => (
            <motion.article
              key={cs.id}
              className="case-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="case-card__media">
                <CardMockup type={cs.category === 'Automation' ? 'Automation' : 'Web'} />
                {cs.isDemo && <span className="case-card__badge">Demo project</span>}
              </div>

              <div className="case-card__body">
                <div className="case-card__header">
                  <h3 className="case-card__title">{cs.title}</h3>
                  <span className="case-card__cat">{cs.category}</span>
                </div>

                <dl className="case-card__details">
                  <div className="case-card__item">
                    <dt>Problem</dt>
                    <dd>{cs.problem}</dd>
                  </div>
                  <div className="case-card__item">
                    <dt>Solution</dt>
                    <dd>{cs.solution}</dd>
                  </div>
                  <div className="case-card__item case-card__item--metric">
                    <dt>Result metric</dt>
                    <dd className="case-card__metric-val">{cs.metric}</dd>
                  </div>
                </dl>

                <div className="case-card__footer">
                  <span className="case-card__tools-label">Tools used:</span>
                  <ul className="tags">
                    {cs.tools.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal className="work__coming-soon" delay={0.2}>
          <p>More case studies coming soon.</p>
        </Reveal>
      </div>
    </section>
  );
}
