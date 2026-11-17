import { useState, useEffect } from 'react';
import Reveal from './Reveal';
import { API_BASE } from '../config';

interface ApprovedReview {
  id: number | string;
  name: string;
  role?: string;
  company: string;
  projectType: string;
  rating?: number;
  reviewText: string;
  createdAt?: string;
}

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
  const [reviews, setReviews] = useState<ApprovedReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/review/approved`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const reviewsToShow = reviews.slice(0, 3);
  const hasApproved = reviews.length > 0;

  return (
    <section className="section reviews-strip" id="testimonials" aria-label="Client Testimonials">
      <div className="container">
        <div className="section__head section__head--row">
          <div>
            <Reveal as="p" className="eyebrow eyebrow--no-counter">Client Testimonials</Reveal>
            <Reveal as="h2" className="section__title" delay={0.05}>
              Proven client experiences.
            </Reveal>
            <Reveal as="p" className="section__lead" delay={0.1}>
              Honest feedback and verified reviews from businesses we engineer software for.
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <a href="/reviews" className="link-arrow">
              View all reviews & submit feedback <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>

        {hasApproved ? (
          <div className="reviews-grid">
            {reviewsToShow.map((rev, i) => {
              const authorName = rev.name || 'Client';
              const authorRole = rev.role || '';
              const text = rev.reviewText || '';
              return (
                <Reveal key={rev.id} className="review-card" delay={0.05 * (i + 1)}>
                  <div className="review-card__top">
                    <span className="review-card__type">{rev.projectType}</span>
                    {renderStars(rev.rating)}
                  </div>
                  <blockquote className="review-card__quote">
                    “{text}”
                  </blockquote>
                  <div className="review-card__author">
                    <div className="review-card__avatar" aria-hidden="true">
                      {authorName.charAt(0)}
                    </div>
                    <div>
                      <b className="review-card__name">{authorName}</b>
                      <span className="review-card__role">
                        {authorRole ? `${authorRole}, ` : ''}{rev.company}
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        ) : loaded ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', background: '#f7f2ea', borderRadius: 12, border: '1px solid #e5d6bf', marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 15, color: '#102b23', fontWeight: 600 }}>
              No approved reviews published yet.
            </p>
            <p style={{ margin: '6px 0 16px', fontSize: 13, color: '#716c60' }}>
              Have you worked with Valance? We’d value your honest feedback.
            </p>
            <a href="/reviews#submit-review" className="btn btn--primary" style={{ display: 'inline-flex', padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}>
              Submit a Client Review →
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
