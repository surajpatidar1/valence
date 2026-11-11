import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import { ToastProvider, useToast } from './Toast';
import { CONTACT } from '../data/contact';
import { APPROVED_REVIEWS, type ProjectType } from '../data/reviews';

const PROJECT_TYPES: ProjectType[] = [
  'Website',
  'Mobile app',
  'SEO',
  'Automation',
  'AI/LLM',
  'Developers',
];

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

/* ==========================================================================
   Review Submission Form
   ========================================================================== */

interface ReviewFormValues {
  name: string;
  company: string;
  role: string;
  projectType: string;
  rating: number;
  reviewText: string;
  consent: boolean;
  _gotcha: string;
}

type ReviewFormErrors = Partial<Record<keyof ReviewFormValues, string>>;

function validateReviewForm(v: ReviewFormValues): ReviewFormErrors {
  const e: ReviewFormErrors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (v.company.trim().length < 2) e.company = 'Please enter your company name.';
  if (v.role.trim().length < 2) e.role = 'Please enter your role or title.';
  if (!v.projectType) e.projectType = 'Please select the project type.';
  if (!v.rating || v.rating < 1 || v.rating > 5) e.rating = 'Please select a rating (1 to 5 stars).';
  if (v.reviewText.trim().length < 15) e.reviewText = 'Please provide your review (at least 15 characters).';
  if (!v.consent) e.consent = 'You must agree before your review can be submitted.';
  return e;
}

function ReviewSubmissionForm() {
  const toast = useToast();
  const [v, setV] = useState<ReviewFormValues>({
    name: '',
    company: '',
    role: '',
    projectType: '',
    rating: 5,
    reviewText: '',
    consent: false,
    _gotcha: '',
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof ReviewFormValues, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const errors = validateReviewForm(v);
  const err = (k: keyof ReviewFormValues) => (touched[k] ? errors[k] : undefined);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      company: true,
      role: true,
      projectType: true,
      rating: true,
      reviewText: true,
      consent: true,
    });

    const keys = Object.keys(errors) as (keyof ReviewFormValues)[];
    if (keys.length) {
      document.getElementById(`rf-${keys[0]}`)?.focus();
      return;
    }

    if (v._gotcha) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const endpoint = CONTACT.reviewFormEndpoint || '[REVIEW FORM ENDPOINT]';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          type: 'Client Review Submission',
          name: v.name,
          company: v.company,
          role: v.role,
          projectType: v.projectType,
          rating: v.rating,
          reviewText: v.reviewText,
          consent: v.consent,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
      toast(`Unable to submit review. Please reach out directly to ${CONTACT.email}.`);
    }
  };

  const ratingDescriptions = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];
  const currentRating = hoverRating ?? v.rating;

  return (
    <div className="partner-form-wrap" id="submit-review">
      <AnimatePresence mode="wait">
        {status !== 'sent' ? (
          <motion.form
            key="rf-form"
            className="form partner-form"
            noValidate
            onSubmit={handleSubmit}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="partner-form__intro">
              <span className="eyebrow eyebrow--no-counter">Share Your Feedback</span>
              <h3>Submit a client review</h3>
              <p>Tell us about your experience working with Valance. Submissions are reviewed by our team before publishing.</p>
            </div>

            {/* Spam Honeypot */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="rf-gotcha">Do not fill this field</label>
              <input
                id="rf-gotcha"
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={v._gotcha}
                onChange={(e) => setV((s) => ({ ...s, _gotcha: e.target.value }))}
              />
            </div>

            <div className="form__row">
              <div className={`field${err('name') ? ' has-error' : ''}`}>
                <input
                  id="rf-name"
                  type="text"
                  placeholder=" "
                  autoComplete="name"
                  value={v.name}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, name: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  aria-invalid={!!err('name')}
                  aria-describedby={err('name') ? 'e-rf-name' : undefined}
                />
                <label htmlFor="rf-name">Your name *</label>
                {err('name') && <span className="field__err" id="e-rf-name">{err('name')}</span>}
              </div>

              <div className={`field${err('company') ? ' has-error' : ''}`}>
                <input
                  id="rf-company"
                  type="text"
                  placeholder=" "
                  autoComplete="organization"
                  value={v.company}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, company: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, company: true }))}
                  aria-invalid={!!err('company')}
                  aria-describedby={err('company') ? 'e-rf-company' : undefined}
                />
                <label htmlFor="rf-company">Company name *</label>
                {err('company') && <span className="field__err" id="e-rf-company">{err('company')}</span>}
              </div>
            </div>

            <div className="form__row">
              <div className={`field${err('role') ? ' has-error' : ''}`}>
                <input
                  id="rf-role"
                  type="text"
                  placeholder=" "
                  value={v.role}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, role: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, role: true }))}
                  aria-invalid={!!err('role')}
                  aria-describedby={err('role') ? 'e-rf-role' : undefined}
                />
                <label htmlFor="rf-role">Your role (e.g. CEO, CTO, Operations Lead) *</label>
                {err('role') && <span className="field__err" id="e-rf-role">{err('role')}</span>}
              </div>

              <div className={`field${err('projectType') ? ' has-error' : ''}`}>
                <select
                  id="rf-projectType"
                  className={v.projectType ? 'has-value' : ''}
                  value={v.projectType}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, projectType: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, projectType: true }))}
                  aria-invalid={!!err('projectType')}
                  aria-describedby={err('projectType') ? 'e-rf-projectType' : undefined}
                >
                  <option value="" disabled hidden></option>
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
                <label htmlFor="rf-projectType">Project type *</label>
                {err('projectType') && <span className="field__err" id="e-rf-projectType">{err('projectType')}</span>}
              </div>
            </div>

            {/* Rating Stars Picker */}
            <div className={`rating-field${err('rating') ? ' has-error' : ''}`} id="rf-rating">
              <label className="rating-field__label">Rating *</label>
              <div className="rating-picker" role="radiogroup" aria-label="Rating out of 5 stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = currentRating >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      role="radio"
                      aria-checked={v.rating === star}
                      aria-label={`${star} star${star > 1 ? 's' : ''} - ${ratingDescriptions[star]}`}
                      className={`rating-picker__star${filled ? ' is-filled' : ''}`}
                      onClick={() => setV((s) => ({ ...s, rating: star }))}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                    >
                      ★
                    </button>
                  );
                })}
                <span className="rating-picker__text">
                  {currentRating > 0 ? `${currentRating} / 5 (${ratingDescriptions[currentRating]})` : 'Select rating'}
                </span>
              </div>
              {err('rating') && <span className="field__err">{err('rating')}</span>}
            </div>

            <div className={`field${err('reviewText') ? ' has-error' : ''}`}>
              <textarea
                id="rf-reviewText"
                rows={4}
                placeholder=" "
                value={v.reviewText}
                onChange={(e) => {
                  if (status === 'error') setStatus('idle');
                  setV((s) => ({ ...s, reviewText: e.target.value }));
                }}
                onBlur={() => setTouched((t) => ({ ...t, reviewText: true }))}
                aria-invalid={!!err('reviewText')}
                aria-describedby={err('reviewText') ? 'e-rf-reviewText' : undefined}
              />
              <label htmlFor="rf-reviewText">Your review (how was the delivery, communication, and result?) *</label>
              {err('reviewText') && <span className="field__err" id="e-rf-reviewText">{err('reviewText')}</span>}
            </div>

            {/* Consent Checkbox */}
            <div className={`field-checkbox${err('consent') ? ' has-error' : ''}`}>
              <label className="checkbox-label" htmlFor="rf-consent">
                <input
                  id="rf-consent"
                  type="checkbox"
                  checked={v.consent}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, consent: e.target.checked }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, consent: true }))}
                  aria-invalid={!!err('consent')}
                  aria-describedby={err('consent') ? 'e-rf-consent' : undefined}
                />
                <span className="checkbox-custom" aria-hidden="true" />
                <span className="checkbox-text">
                  I agree that Valance may publish this review with my name and company. *
                </span>
              </label>
              {err('consent') && <span className="field__err" id="e-rf-consent">{err('consent')}</span>}
            </div>

            {status === 'error' && (
              <div className="form__alert form__alert--error" role="alert">
                <strong>Submission failed.</strong>
                <span> Please try again or reach out directly to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn--primary btn--block${status === 'sending' ? ' is-loading' : ''}`}
              disabled={status === 'sending'}
            >
              <span className="btn__label">{status === 'sending' ? 'Submitting review…' : 'Submit review'}</span>
              <span className="btn__spinner" aria-hidden="true" />
            </button>
            <p className="form__note">
              Submissions are not published immediately; they are reviewed before appearing on the site.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="rf-success"
            className="form form__success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            role="status"
          >
            <svg className="check" viewBox="0 0 52 52" aria-hidden="true">
              <motion.circle cx="26" cy="26" r="24" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <motion.path d="m15 27 7 7 15-15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.5 }} />
            </svg>
            <h3>Thank You!</h3>
            <p>
              Your review has been submitted for approval. We appreciate your feedback and partnership.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   Main Reviews Page Component
   ========================================================================== */

export default function ReviewsPage() {
  const hasApproved = APPROVED_REVIEWS.length > 0;

  // Extract unique project types present in approved reviews
  const availableTypes: string[] = ['All', ...Array.from(new Set(APPROVED_REVIEWS.map((r) => r.projectType)))];
  const [selectedType, setSelectedType] = useState<string>('All');

  const filteredReviews = selectedType === 'All'
    ? APPROVED_REVIEWS
    : APPROVED_REVIEWS.filter((r) => r.projectType === selectedType);

  return (
    <ToastProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header isReviews />
      <main id="main">
        {/* 1. HERO */}
        <section className="section reviews-hero">
          <div className="container">
            <div className="section__head">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">Client Feedback</Reveal>
              <Reveal as="h1" className="section__title" delay={0.05}>
                What our clients say.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Honest feedback from the businesses we have worked with.
              </Reveal>
            </div>
          </div>
        </section>

        {/* 2. REVIEWS LIST OR EMPTY STATE */}
        <section className="section reviews-list-section">
          <div className="container">
            {hasApproved ? (
              <>
                {/* Filter chips (only project types with at least 1 review) */}
                {availableTypes.length > 2 && (
                  <div className="reviews-filter" role="tablist" aria-label="Filter reviews by project type">
                    {availableTypes.map((type) => {
                      const active = selectedType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          className={`filter-chip${active ? ' is-active' : ''}`}
                          onClick={() => setSelectedType(type)}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="reviews-grid">
                  {filteredReviews.map((rev, i) => (
                    <Reveal key={rev.id} className="review-card" delay={0.05 * (i % 4)}>
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
              </>
            ) : (
              /* EMPTY STATE */
              <div className="reviews-empty">
                <div className="reviews-empty__card">
                  <div className="reviews-empty__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3>Reviews are coming soon.</h3>
                  <p>
                    We are delivering our first projects, and we will share real client feedback here as it comes in.
                  </p>
                  <div className="reviews-empty__actions">
                    <MagneticButton href="/#contact" variant="primary">
                      Start a project
                    </MagneticButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. SHARE YOUR EXPERIENCE FORM */}
        <section className="section reviews-form-section" id="share-experience">
          <div className="container">
            <div className="section__head section__head--center">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">Your Experience</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                Share your experience.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Worked with Valance on a recent engagement? We welcome your candid feedback.
              </Reveal>
            </div>

            <ReviewSubmissionForm />
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </ToastProvider>
  );
}

