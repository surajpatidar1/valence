import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import Reveal from './Reveal';

type Service = {
  id: string;
  title: string;
  summary: string;
  description: string;
  included: string[];
  tools: string[];
  icon: ReactNode;
};

const SERVICES: Service[] = [
  {
    id: 'web',
    title: 'Web Development',
    summary: 'Websites and web applications',
    description:
      'Fast, secure and responsive websites and web applications, designed around your users and built to turn visitors into customers.',
    included: ['Company websites & landing pages', 'Custom web applications & dashboards', 'E-commerce stores', 'Performance, accessibility & security'],
    tools: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
  },
  {
    id: 'app',
    title: 'App Development',
    summary: 'iOS and Android apps',
    description:
      'Mobile apps for iOS and Android built from a single codebase, taking you from first prototype through to App Store and Google Play launch.',
    included: ['iOS & Android apps', 'UI/UX design & prototyping', 'APIs & backend development', 'App Store & Play Store release'],
    tools: ['React Native', 'Flutter', 'Firebase', 'Node.js'],
    icon: <><rect x="7" y="2.5" width="10" height="19" rx="2.2" /><path d="M11 18.5h2" /></>,
  },
  {
    id: 'seo',
    title: 'SEO',
    summary: 'Search visibility and growth',
    description:
      'Technical and on-page SEO that helps the right customers find your business on Google, with clear reporting on what is working.',
    included: ['Technical SEO audit & fixes', 'Keyword research & on-page optimisation', 'Site speed & Core Web Vitals', 'Monthly performance reporting'],
    tools: ['Search Console', 'Google Analytics 4', 'Semrush', 'Ahrefs'],
    icon: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2M8.5 12.5l2-2 1.5 1.5 2-2.5" /></>,
  },
  {
    id: 'automation',
    title: 'Business Automation',
    summary: 'Workflows that run themselves',
    description:
      'We connect the tools you already use and automate repetitive tasks such as data entry, invoicing and reporting, so your team can focus on higher-value work.',
    included: ['Process mapping & recommendations', 'CRM, ERP & accounting integrations', 'Automated reports & notifications', 'Document & data processing'],
    tools: ['n8n', 'Make', 'Zapier', 'Python'],
    icon: <><circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M8.2 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.8" /></>,
  },
  {
    id: 'llm',
    title: 'LLM Integration',
    summary: 'Practical AI for your business',
    description:
      'AI features built into your products and processes, from support assistants to document search, using leading large language models with privacy in mind.',
    included: ['AI chatbots & support assistants', 'Search & Q&A over your documents (RAG)', 'AI features inside your apps', 'Secure, private deployment options'],
    tools: ['OpenAI', 'Anthropic Claude', 'LangChain', 'Vector databases'],
    icon: <><path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9-5.7-1.8L10.2 9z" /><path d="M18.5 3.5v3M17 5h3" /></>,
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const s = SERVICES[active];

  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">What we do</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>Digital products and automation, built properly.</Reveal>
          <Reveal as="p" className="section__lead" delay={0.1}>
            One team for your website, your app, your search visibility and the AI and automation behind your operations.
          </Reveal>
        </div>

        <Reveal className="svc">
          <div className="svc__list" role="tablist" aria-label="Our services" aria-orientation="vertical">
            {SERVICES.map((item, i) => (
              <button
                key={item.id}
                id={`svc-tab-${item.id}`}
                role="tab"
                aria-selected={active === i}
                aria-controls="svc-panel"
                tabIndex={active === i ? 0 : -1}
                className={`svc__tab${active === i ? ' is-active' : ''}`}
                style={{ order: i * 2 }}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const next = (i + (e.key === 'ArrowDown' ? 1 : -1) + SERVICES.length) % SERVICES.length;
                    setActive(next);
                    document.getElementById(`svc-tab-${SERVICES[next].id}`)?.focus();
                  }
                }}
              >
                <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="svc__name">
                  {item.title}
                  <small>{item.summary}</small>
                </span>
                <span className="svc__arrow" aria-hidden="true">→</span>
              </button>
            ))}

            <div
              id="svc-panel"
              role="tabpanel"
              aria-labelledby={`svc-tab-${s.id}`}
              className="svc__panel"
              style={{ order: active * 2 + 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="svc__icon" aria-hidden="true"><svg viewBox="0 0 24 24">{s.icon}</svg></div>
                  <h3>{s.title}</h3>
                  <p className="svc__desc">{s.description}</p>

                  <h4 className="svc__label">What’s included</h4>
                  <ul className="svc__included">
                    {s.included.map((x) => <li key={x}>{x}</li>)}
                  </ul>

                  <h4 className="svc__label">Tools we use</h4>
                  <ul className="tags">
                    {s.tools.map((t) => <li key={t}>{t}</li>)}
                  </ul>

                  <a href="#contact" className="link-arrow">Discuss your project <span aria-hidden="true">→</span></a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
