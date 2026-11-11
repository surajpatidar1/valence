import { APPROVED_REVIEWS, HAS_APPROVED_REVIEWS } from '../data/reviews';
import Reveal from './Reveal';

function renderStars(rating?: number) {
  if (!rating) return null;
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div className="review-stars" aria-label={`Rating: ${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star${i < clamped ? ' star--filled' : ''}`} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsStrip() {
  if (!HAS_APPROVED_REVIEWS || APPROVED_REVIEWS.length === 0) {
    return null;
  }

  const reviewsToShow = APPROVED_REVIEWS.slice(0, 3);

  return (
    <section className="section reviews-strip" id="reviews" aria-label="Client reviews">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <Reveal as="p" className="eyebrow">Client Feedback</Reveal>
            <Reveal as="h2" className="section__title" delay={0.05}>
              Client reviews.
            </Reveal>
            <Reveal as="p" className="section__lead" delay={0.1}>
              Honest feedback from the businesses we work with.
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <a href="/reviews" className="link-arrow">
              Read all reviews <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>

        <div className="reviews-grid">
          {reviewsToShow.map((rev, i) => (
            <Reveal key={rev.id} className="review-card" delay={0.05 * (i + 1)}>
              <div className="review-card__top">
                <span className="review-card__type">{rev.projectType}</span>
                {renderStars(rev.rating)}
              </div>
              <blockquote className="review-card__quote">
                “{rev.quote}”
              </blockquote>
              <div className="review-card__author">
                <div className="review-card__avatar" aria-hidden="true">
                  {rev.clientName.charAt(0)}
                </div>
                <div>
                  <b className="review-card__name">{rev.clientName}</b>
                  <span className="review-card__role">
                    {rev.clientRole}, {rev.company}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

