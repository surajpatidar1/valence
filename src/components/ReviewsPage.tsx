import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import { ToastProvider, useToast } from './Toast';
import { CONTACT } from '../data/contact';
import { API_BASE } from '../config';
import type { ProjectType } from '../data/reviews';

const PROJECT_TYPES: ProjectType[] = [
  'Website',
  'Mobile app',
  'SEO',
  'Automation',
  'AI/LLM',
  'Developers',
];

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
      const endpoint = CONTACT.reviewFormEndpoint || `${API_BASE}/review`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: v.name,
          company: v.company,
          role: v.role,
          projectType: v.projectType,
          rating: v.rating,
          reviewText: v.reviewText,
          consent: v.consent,
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
              <span className="eyebrow eyebrow--no-counter">Client Feedback</span>
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
  return (
    <ToastProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header isReviews />
      <main id="main">
        <section className="section reviews-hero" style={{ paddingBottom: 'clamp(60px, 8vw, 100px)' }}>
          <div className="container">
            <div className="section__head section__head--center" style={{ marginBottom: 'clamp(32px, 5vw, 48px)' }}>
              {/* Greeting Message */}
              <Reveal as="h1" className="section__title" delay={0.05}>
                Welcome, Valued Partner.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1} style={{ maxWidth: '640px', marginInline: 'auto' }}>
                Warm greetings from the entire Valance team! We truly appreciate our collaboration and value your partnership. Please share your candid feedback and experience below—your insights directly shape how we engineer, communicate, and deliver exceptional solutions.
              </Reveal>
            </div>

            {/* 3. Review Submission Form */}
            <ReviewSubmissionForm />
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </ToastProvider>
  );
}
