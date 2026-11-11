import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import MagneticButton from './MagneticButton';
import { HAS_PROJECTS } from '../data/projects';
import { CONTACT } from '../data/contact';

const LINKS = [
  { href: '#services', label: 'Services' },
  ...(HAS_PROJECTS ? [{ href: '#work', label: 'Work' }] : []),
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > prev && y > 400 && !open);
  });

  // Scroll-spy: highlight the nav link for the section in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.header
        id="top"
        className={`header${scrolled ? ' is-scrolled' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="nav container" aria-label="Primary">
          <Logo />
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={active === l.href ? 'is-active' : ''} aria-current={active === l.href ? 'true' : undefined}>
                  {l.label}
                  {active === l.href && <motion.span layoutId="nav-pill" className="nav__pill" />}
                </a>
              </li>
            ))}
          </ul>
          <MagneticButton href="#contact" size="sm" className="nav__cta">
            Book a call <span aria-hidden="true">↗</span>
          </MagneticButton>
          <button
            className={`nav__toggle${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {[...LINKS, { href: '#contact', label: 'Contact' }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
                </motion.li>
              ))}
            </ul>
            <a className="mobile-menu__foot" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
