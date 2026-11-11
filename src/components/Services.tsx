import Reveal from './Reveal';

type ServiceItem = {
  id: string;
  num: string;
  title: string;
  description: string;
  points: string[];
  topic: string;
  tag?: string;
};

const SERVICES: ServiceItem[] = [
  {
    id: 'automation',
    num: '01',
    title: 'Business Automation',
    description: 'Workflows that run themselves.',
    points: [
      'Orders, invoices and follow-ups on autopilot',
      'WhatsApp, email and spreadsheet integrations',
      'Dashboards and alerts for your team',
    ],
    topic: 'Automation',
    tag: 'Our focus',
  },
  {
    id: 'llm',
    num: '02',
    title: 'LLM Integration',
    description: 'Practical AI for your business.',
    points: [
      'AI chatbots and support assistants',
      'Search and Q&A over your documents',
      'Private deployment options',
    ],
    topic: 'AI / LLM',
  },
  {
    id: 'web',
    num: '03',
    title: 'Web Development',
    description: 'Websites and web applications.',
    points: [
      'Fast, responsive business websites',
      'Custom web apps and dashboards',
      'Built to be easy to maintain',
    ],
    topic: 'Website',
  },
  {
    id: 'app',
    num: '04',
    title: 'App Development',
    description: 'iOS and Android apps.',
    points: [
      'Native and cross-platform apps',
      'Clean design and smooth performance',
      'Launch on the App Store and Google Play',
    ],
    topic: 'Mobile app',
  },
  {
    id: 'seo',
    num: '05',
    title: 'SEO',
    description: 'Search visibility and growth.',
    points: [
      'Technical SEO audit and fixes',
      'Keyword research and on-page work',
      'Clear monthly reporting',
    ],
    topic: 'SEO',
  },
];

export default function Services() {
  const handleSelectTopic = (topic: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('select-contact-topic', { detail: topic }));
      const radios = document.querySelectorAll<HTMLInputElement>('input[name="topic"]');
      radios.forEach((r) => {
        if (r.nextElementSibling?.textContent?.trim() === topic) {
          r.checked = true;
          r.click();
        }
      });
    }
  };

  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section__head">
          <Reveal as="p" className="eyebrow">What we do</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>
            Digital products and automation, built properly.
          </Reveal>
          <Reveal as="p" className="section__lead" delay={0.1}>
            One team for your website, your app, your search visibility and the AI and automation behind your operations.
          </Reveal>
        </div>

        <div className="svc-cards">
          {SERVICES.map((s, i) => (
            <Reveal
              key={s.id}
              className={`svc-card${s.tag ? ' svc-card--focus' : ''}`}
              delay={0.04 * (i + 1)}
            >
              {/* Header: Num, Tag, and Inquire Link */}
              <div className="svc-card__header">
                <div className="svc-card__meta">
                  <span className="svc-card__num">{s.num}</span>
                  {s.tag && <span className="svc-card__tag">{s.tag}</span>}
                </div>
                <a
                  href="#contact"
                  onClick={() => handleSelectTopic(s.topic)}
                  className="svc-card__action"
                  aria-label={`Discuss ${s.title}`}
                >
                  <span>Discuss</span>
                  <span className="svc-card__arrow" aria-hidden="true">→</span>
                </a>
              </div>

              {/* Title & One-line Summary */}
              <h3 className="svc-card__title">{s.title}</h3>
              <p className="svc-card__desc">{s.description}</p>

              {/* 3 Highlights */}
              <ul className="svc-card__points">
                {s.points.map((pt) => (
                  <li key={pt} className="svc-card__point">
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
