import MagneticButton from './MagneticButton';
import Reveal from './Reveal';

export default function HireBanner() {
  return (
    <section className="hire-banner" aria-label="Hire developers">
      <div className="container">
        <Reveal className="hire-banner__card">
          <div className="hire-banner__content">
            <p className="hire-banner__tag">Flexible Technical Capacity</p>
            <h2 className="hire-banner__title">Need extra developers or a full team?</h2>
            <p className="hire-banner__desc">
              We match senior developers and assemble project teams for deadlines, new products, and specialist features—with clear plans and active delivery management.
            </p>
          </div>
          <div className="hire-banner__actions">
            <MagneticButton href="/partners" variant="gold">
              Hire developers <span aria-hidden="true">→</span>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

