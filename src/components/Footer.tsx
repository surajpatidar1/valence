import Logo from './Logo';
import MagneticButton from './MagneticButton';
import Reveal from './Reveal';
import { CONTACT } from '../data/contact';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <Reveal as="h2" className="footer__big">Have a project in mind?</Reveal>
          <MagneticButton href="/#contact" variant="gold">Start a conversation</MagneticButton>
        </div>
        <div className="footer__grid">
          <div>
            <Logo light href="/" />
            <p className="footer__tag">Web, app and AI solutions for growing businesses.</p>
          </div>
          <nav aria-label="Services">
            <h4>Services</h4>
            <ul>
              <li><a href="/partners">Hire developers</a></li>
              <li><a href="/#services">Web Development</a></li>
              <li><a href="/#services">App Development</a></li>
              <li><a href="/#services">SEO</a></li>
              <li><a href="/#services">Business Automation</a></li>
              <li><a href="/#services">LLM Integration</a></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h4>Company</h4>
            <ul>
              <li><a href="/#work">Our work</a></li>
              <li><a href="/#process">Our process</a></li>
              <li><a href="/#about">About us</a></li>
              <li><a href="/reviews">Reviews</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/partners#developer-form">Become a partner</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </nav>
          <div>
            <h4>Contact</h4>
            <ul className="footer__contact">
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Valance. All rights reserved.</p>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
