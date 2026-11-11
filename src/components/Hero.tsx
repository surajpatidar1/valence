import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import HeroExample from './HeroExample';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ ready }: { ready: boolean }) {
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section className="hero">
      <div className="container">
        <motion.div className="hero__meta" {...fadeUp(0)}>
          <span>Web, app &amp; AI development for growing businesses</span>
        </motion.div>

        <h1 className="hero__title">
          {['We take the busywork', 'out of your business.'].map((line, i) => (
            <span className="line" key={line}>
              <motion.span
                initial={{ y: '105%' }}
                animate={ready ? { y: '0%' } : {}}
                transition={{ duration: 1, delay: 0.1 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="hero__row">
          <motion.p className="hero__lead" {...fadeUp(0.35)}>
            Valance builds websites, mobile apps and AI-powered automation that help businesses
            reach more customers and spend less time on repetitive work.
          </motion.p>
          <motion.div className="hero__actions" {...fadeUp(0.45)}>
            <MagneticButton href="#contact">Book a free consultation</MagneticButton>
            <a href="#services" className="link-arrow">See what we do <span aria-hidden="true">→</span></a>
          </motion.div>
        </div>

        <HeroExample ready={ready} />
      </div>
    </section>
  );
}
