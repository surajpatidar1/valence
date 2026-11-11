import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import { CONTACT } from '../data/contact';

const ABOUT_POINTS = [
  {
    id: 'process',
    num: '01',
    title: 'We learn your process first',
    text: 'We study how your team works before we build anything.',
  },
  {
    id: 'quotes',
    num: '02',
    title: 'Clear, fixed quotes',
    text: 'You know the scope and the price before we start.',
  },
  {
    id: 'demos',
    num: '03',
    title: 'Regular demos',
    text: 'You see working progress along the way, not only at the end.',
  },
  {
    id: 'support',
    num: '04',
    title: 'Support after launch',
    text: 'We stay available for fixes and improvements.',
  },
];

export default function About() {
  const bookingHref = CONTACT.bookingUrl || '#contact';
  const isExternal = Boolean(bookingHref && (bookingHref.startsWith('http') || bookingHref.startsWith('[')));

  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__inner">
          {/* Left Column (Sticky on desktop) */}
          <div className="about__sticky">
            <Reveal as="p" className="eyebrow">About</Reveal>
            <Reveal as="h2" className="section__title" delay={0.05}>
              A team that takes the busywork off your plate.
            </Reveal>
            <Reveal as="p" className="about__lead" delay={0.1}>
              We start by understanding how your business actually runs, then build the websites, apps and automations that take the repetitive work off your plate. You get clear quotes, regular demos and one point of contact from the first call to launch.
            </Reveal>
            <Reveal delay={0.15}>
              <MagneticButton
                href={bookingHref}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                variant="primary"
              >
                Book a free consultation
              </MagneticButton>
            </Reveal>
          </div>

          {/* Straight line separator centered between left and right */}
          <div className="about__separator" aria-hidden="true" />

          {/* Right Column: Pure Premium Editorial Typography */}
          <div className="about__list">
            {ABOUT_POINTS.map((pt, i) => (
              <Reveal key={pt.id} className="about-item" delay={0.06 * (i + 1)}>
                <span className="about-item__num">{pt.num}</span>
                <div className="about-item__content">
                  <h3 className="about-item__title">{pt.title}</h3>
                  <p className="about-item__text">{pt.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
