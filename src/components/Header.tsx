import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import MagneticButton from './MagneticButton';
import { CONTACT } from '../data/contact';
import { HAS_APPROVED_REVIEWS } from '../data/reviews';

const BASE_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header({
  isPartner = false,
  isReviews = false,
}: {
  isPartner?: boolean;
  isReviews?: boolean;
}) {
  const isSubpage = isPartner || isReviews;
  const links = HAS_APPROVED_REVIEWS
    ? [...BASE_LINKS, { href: '/reviews', label: 'Reviews' }]
    : BASE_LINKS;

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
    if (isSubpage) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    BASE_LINKS.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [isSubpage]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const bookingHref = CONTACT.bookingUrl || (isSubpage ? '/#contact' : '#contact');
  const isExternal = Boolean(bookingHref && (bookingHref.startsWith('http') || bookingHref.startsWith('[')));

  const resolveHref = (href: string) => {
    if (href.startsWith('/')) return href;
    return isSubpage ? `/${href}` : href;
  };

  return (
    <>
      <motion.header
        id="top"
        className={`header${scrolled ? ' is-scrolled' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="nav container" aria-label="Primary">
          <Logo href={isSubpage ? '/' : '#top'} />
          <ul className="nav__links">
            {links.map((l) => {
              const href = resolveHref(l.href);
              const isActive = isReviews ? l.href === '/reviews' : (!isSubpage && active === l.href);
              return (
                <li key={l.href}>
                  <a href={href} className={isActive ? 'is-active' : ''} aria-current={isActive ? 'true' : undefined}>
                    {l.label}
                    {isActive && <motion.span layoutId="nav-pill" className="nav__pill" />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="nav__ctas">
            <MagneticButton
              href="/partners"
              variant="gold"
              size="sm"
              className="nav__hire-btn"
            >
              Hire developers
            </MagneticButton>
            <MagneticButton
              href={bookingHref}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              size="sm"
              className="nav__cta"
            >
              Book a call <span aria-hidden="true">↗</span>
            </MagneticButton>
          </div>

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
            <ul className="mobile-menu__nav">
              <motion.li
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mobile-menu__featured-item"
              >
                <a
                  href="/partners"
                  onClick={() => setOpen(false)}
                  className="mobile-menu__hire-btn"
                >
                  Hire developers <span aria-hidden="true">→</span>
                </a>
              </motion.li>

              {[...links, { href: '#contact', label: 'Contact' }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <a href={resolveHref(l.href)} onClick={() => setOpen(false)}>{l.label}</a>
                </motion.li>
              ))}

              <motion.li
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (links.length + 1) * 0.05 }}
              >
                <a href="/partners#developer-form" onClick={() => setOpen(false)}>Become a partner</a>
              </motion.li>
            </ul>
            <a className="mobile-menu__foot" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
