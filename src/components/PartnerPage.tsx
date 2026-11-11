import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import { ToastProvider, useToast } from './Toast';
import { CONTACT } from '../data/contact';

const NEED_OPTIONS = [
  'Extra developers',
  'A small team',
  'A specialist',
  'Ongoing support',
  'Not sure yet',
];

const SKILL_CHIPS = [
  'Frontend',
  'Backend',
  'Mobile',
  'AI/LLM',
  'Automation',
  'QA',
  'Design',
];

const DURATION_OPTIONS = [
  'under 1 month',
  '1-3 months',
  '3+ months',
  'ongoing',
];

const START_OPTIONS = [
  'this week',
  'within 2 weeks',
  'within a month',
  'flexible',
];

const DEV_SKILLS = [
  'Frontend',
  'Backend',
  'Mobile',
  'AI/LLM',
  'Automation',
  'QA',
  'Design',
  'Other',
];

const AVAILABILITY = [
  'Full-time',
  'Part-time',
  'Per project',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ==========================================================================
   Company Request Form
   ========================================================================== */

interface CompanyValues {
  companyName: string;
  name: string;
  email: string;
  need: string;
  skills: string[];
  duration: string;
  startDate: string;
  budget: string;
  details: string;
  _gotcha: string;
}

type CompanyErrors = Partial<Record<keyof CompanyValues, string>>;

function validateCompany(v: CompanyValues): CompanyErrors {
  const e: CompanyErrors = {};
  if (v.companyName.trim().length < 2) e.companyName = 'Please enter your company name.';
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid work email address.';
  if (!v.need) e.need = 'Please select what you need.';
  if (!v.duration) e.duration = 'Please select expected duration.';
  if (!v.startDate) e.startDate = 'Please select when to start.';
  if (v.details.trim().length < 10) e.details = 'Please provide a few details about your project (at least 10 characters).';
  return e;
}

function CompanyForm() {
  const toast = useToast();
  const [v, setV] = useState<CompanyValues>({
    companyName: '',
    name: '',
    email: '',
    need: '',
    skills: [],
    duration: '',
    startDate: '',
    budget: '',
    details: '',
    _gotcha: '',
  });

  const [touched, setTouched] = useState<Partial<Record<keyof CompanyValues, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const errors = validateCompany(v);
  const err = (k: keyof CompanyValues) => (touched[k] ? errors[k] : undefined);

  const toggleSkill = (skill: string) => {
    setV((s) => ({
      ...s,
      skills: s.skills.includes(skill)
        ? s.skills.filter((x) => x !== skill)
        : [...s.skills, skill],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      companyName: true,
      name: true,
      email: true,
      need: true,
      duration: true,
      startDate: true,
      details: true,
    });

    const keys = Object.keys(errors) as (keyof CompanyValues)[];
    if (keys.length) {
      document.getElementById(`cf-${keys[0]}`)?.focus();
      return;
    }

    if (v._gotcha) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const endpoint = CONTACT.companyRequestEndpoint || '[COMPANY REQUEST ENDPOINT]';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          type: 'Company Developer Request',
          companyName: v.companyName,
          name: v.name,
          email: v.email,
          need: v.need,
          skills: v.skills,
          duration: v.duration,
          startDate: v.startDate,
          budget: v.budget || 'Not specified',
          details: v.details,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
      toast(`Unable to send request. Please email us directly at ${CONTACT.email}.`);
    }
  };

  return (
    <div className="partner-form-wrap">
      <AnimatePresence mode="wait">
        {status !== 'sent' ? (
          <motion.form
            key="c-form"
            className="form partner-form"
            noValidate
            onSubmit={handleSubmit}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="partner-form__intro">
              <span className="eyebrow eyebrow--no-counter">Company Request</span>
              <h3>Request developers for your project</h3>
              <p>Tell us what you need to build or ship. We match the right specialists and reply with a plan within one business day.</p>
            </div>

            {/* Spam Honeypot */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="cf-gotcha">Do not fill this field</label>
              <input
                id="cf-gotcha"
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={v._gotcha}
                onChange={(e) => setV((s) => ({ ...s, _gotcha: e.target.value }))}
              />
            </div>

            <div className="form__row">
              <div className={`field${err('companyName') ? ' has-error' : ''}`}>
                <input
                  id="cf-companyName"
                  type="text"
                  placeholder=" "
                  autoComplete="organization"
                  value={v.companyName}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, companyName: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, companyName: true }))}
                  aria-invalid={!!err('companyName')}
                  aria-describedby={err('companyName') ? 'e-cf-companyName' : undefined}
                />
                <label htmlFor="cf-companyName">Company name *</label>
                {err('companyName') && <span className="field__err" id="e-cf-companyName">{err('companyName')}</span>}
              </div>

              <div className={`field${err('name') ? ' has-error' : ''}`}>
                <input
                  id="cf-name"
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
                  aria-describedby={err('name') ? 'e-cf-name' : undefined}
                />
                <label htmlFor="cf-name">Your name *</label>
                {err('name') && <span className="field__err" id="e-cf-name">{err('name')}</span>}
              </div>
            </div>

            <div className="form__row">
              <div className={`field${err('email') ? ' has-error' : ''}`}>
                <input
                  id="cf-email"
                  type="email"
                  placeholder=" "
                  autoComplete="email"
                  value={v.email}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, email: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!err('email')}
                  aria-describedby={err('email') ? 'e-cf-email' : undefined}
                />
                <label htmlFor="cf-email">Work email address *</label>
                {err('email') && <span className="field__err" id="e-cf-email">{err('email')}</span>}
              </div>

              <div className={`field${err('need') ? ' has-error' : ''}`}>
                <select
                  id="cf-need"
                  className={v.need ? 'has-value' : ''}
                  value={v.need}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, need: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, need: true }))}
                  aria-invalid={!!err('need')}
                  aria-describedby={err('need') ? 'e-cf-need' : undefined}
                >
                  <option value="" disabled hidden></option>
                  {NEED_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <label htmlFor="cf-need">What you need *</label>
                {err('need') && <span className="field__err" id="e-cf-need">{err('need')}</span>}
              </div>
            </div>

            {/* Skills Needed Chips */}
            <fieldset className="chips chips--skills">
              <legend>Skills needed <span>(select all that apply)</span></legend>
              <div className="chips__group">
                {SKILL_CHIPS.map((chip) => {
                  const active = v.skills.includes(chip);
                  return (
                    <button
                      type="button"
                      key={chip}
                      className={`chip-btn${active ? ' is-active' : ''}`}
                      onClick={() => toggleSkill(chip)}
                      aria-pressed={active}
                    >
                      <span className="chip-btn__check" aria-hidden="true">{active ? '✓' : '+'}</span>
                      {chip}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="form__row">
              <div className={`field${err('duration') ? ' has-error' : ''}`}>
                <select
                  id="cf-duration"
                  className={v.duration ? 'has-value' : ''}
                  value={v.duration}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, duration: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, duration: true }))}
                  aria-invalid={!!err('duration')}
                  aria-describedby={err('duration') ? 'e-cf-duration' : undefined}
                >
                  <option value="" disabled hidden></option>
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <label htmlFor="cf-duration">Expected duration *</label>
                {err('duration') && <span className="field__err" id="e-cf-duration">{err('duration')}</span>}
              </div>

              <div className={`field${err('startDate') ? ' has-error' : ''}`}>
                <select
                  id="cf-startDate"
                  className={v.startDate ? 'has-value' : ''}
                  value={v.startDate}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, startDate: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, startDate: true }))}
                  aria-invalid={!!err('startDate')}
                  aria-describedby={err('startDate') ? 'e-cf-startDate' : undefined}
                >
                  <option value="" disabled hidden></option>
                  {START_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <label htmlFor="cf-startDate">When to start *</label>
                {err('startDate') && <span className="field__err" id="e-cf-startDate">{err('startDate')}</span>}
              </div>
            </div>

            <div className="field">
              <input
                id="cf-budget"
                type="text"
                placeholder=" "
                value={v.budget}
                onChange={(e) => setV((s) => ({ ...s, budget: e.target.value }))}
              />
              <label htmlFor="cf-budget">Budget range (optional, e.g. $5k - $15k, or Hourly)</label>
            </div>

            <div className={`field${err('details') ? ' has-error' : ''}`}>
              <textarea
                id="cf-details"
                rows={4}
                placeholder=" "
                value={v.details}
                onChange={(e) => {
                  if (status === 'error') setStatus('idle');
                  setV((s) => ({ ...s, details: e.target.value }));
                }}
                onBlur={() => setTouched((t) => ({ ...t, details: true }))}
                aria-invalid={!!err('details')}
                aria-describedby={err('details') ? 'e-cf-details' : undefined}
              />
              <label htmlFor="cf-details">Project details (what you are building or trying to solve) *</label>
              {err('details') && <span className="field__err" id="e-cf-details">{err('details')}</span>}
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
              <span className="btn__label">{status === 'sending' ? 'Submitting request…' : 'Submit developer request'}</span>
              <span className="btn__spinner" aria-hidden="true" />
            </button>
            <p className="form__note">
              We respond with a matched plan and quote within one business day. NDA available on request.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="c-success"
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
            <h3>Request Received!</h3>
            <p>
              Thanks, {v.name.trim().split(' ')[0]}. We have received your requirements for {v.companyName.trim()} and will get back to you within one business day.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   Developer Application Form
   ========================================================================== */

interface DevValues {
  fullName: string;
  email: string;
  skill: string;
  experience: string;
  portfolio: string;
  availability: string;
  message: string;
  _gotcha: string;
}

type DevErrors = Partial<Record<keyof DevValues, string>>;

function validateDev(v: DevValues): DevErrors {
  const e: DevErrors = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.skill) e.skill = 'Please select your primary skill.';
  if (!v.experience.trim()) e.experience = 'Please indicate your years of experience.';
  if (!v.availability) e.availability = 'Please select your availability.';
  if (v.message.trim().length < 10) e.message = 'Please provide a short message (at least 10 characters).';
  return e;
}

function DeveloperForm() {
  const toast = useToast();
  const [v, setV] = useState<DevValues>({
    fullName: '',
    email: '',
    skill: '',
    experience: '',
    portfolio: '',
    availability: '',
    message: '',
    _gotcha: '',
  });

  const [touched, setTouched] = useState<Partial<Record<keyof DevValues, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const errors = validateDev(v);
  const err = (k: keyof DevValues) => (touched[k] ? errors[k] : undefined);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      skill: true,
      experience: true,
      availability: true,
      message: true,
    });

    const keys = Object.keys(errors) as (keyof DevValues)[];
    if (keys.length) {
      document.getElementById(`df-${keys[0]}`)?.focus();
      return;
    }

    if (v._gotcha) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const endpoint = CONTACT.partnerFormEndpoint || '[FORM ENDPOINT, e.g. Formspree URL or my n8n webhook URL]';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          type: 'Developer Application',
          fullName: v.fullName,
          email: v.email,
          skill: v.skill,
          experience: v.experience,
          portfolio: v.portfolio,
          availability: v.availability,
          message: v.message,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
      toast(`Unable to send application. Please email us directly at ${CONTACT.email}.`);
    }
  };

  return (
    <div className="partner-form-wrap">
      <AnimatePresence mode="wait">
        {status !== 'sent' ? (
          <motion.form
            key="df-form"
            className="form partner-form"
            noValidate
            onSubmit={handleSubmit}
            exit={{ opacity: 0, scale: 0.97 }}
          >
            <div className="partner-form__intro">
              <span className="eyebrow eyebrow--no-counter">Developer Network</span>
              <h3>Are you a developer? Join our partner network.</h3>
              <p>We partner with high-calibre senior developers, designers, and automation specialists for client engagements.</p>
            </div>

            {/* Spam Honeypot */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="df-gotcha">Do not fill this field</label>
              <input
                id="df-gotcha"
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={v._gotcha}
                onChange={(e) => setV((s) => ({ ...s, _gotcha: e.target.value }))}
              />
            </div>

            <div className="form__row">
              <div className={`field${err('fullName') ? ' has-error' : ''}`}>
                <input
                  id="df-fullName"
                  type="text"
                  placeholder=" "
                  autoComplete="name"
                  value={v.fullName}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, fullName: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                  aria-invalid={!!err('fullName')}
                  aria-describedby={err('fullName') ? 'e-df-fullName' : undefined}
                />
                <label htmlFor="df-fullName">Full name *</label>
                {err('fullName') && <span className="field__err" id="e-df-fullName">{err('fullName')}</span>}
              </div>

              <div className={`field${err('email') ? ' has-error' : ''}`}>
                <input
                  id="df-email"
                  type="email"
                  placeholder=" "
                  autoComplete="email"
                  value={v.email}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, email: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!err('email')}
                  aria-describedby={err('email') ? 'e-df-email' : undefined}
                />
                <label htmlFor="df-email">Email address *</label>
                {err('email') && <span className="field__err" id="e-df-email">{err('email')}</span>}
              </div>
            </div>

            <div className="form__row">
              <div className={`field${err('skill') ? ' has-error' : ''}`}>
                <select
                  id="df-skill"
                  className={v.skill ? 'has-value' : ''}
                  value={v.skill}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, skill: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, skill: true }))}
                  aria-invalid={!!err('skill')}
                  aria-describedby={err('skill') ? 'e-df-skill' : undefined}
                >
                  <option value="" disabled hidden></option>
                  {DEV_SKILLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <label htmlFor="df-skill">Primary skill *</label>
                {err('skill') && <span className="field__err" id="e-df-skill">{err('skill')}</span>}
              </div>

              <div className={`field${err('experience') ? ' has-error' : ''}`}>
                <input
                  id="df-experience"
                  type="text"
                  placeholder=" "
                  value={v.experience}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, experience: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, experience: true }))}
                  aria-invalid={!!err('experience')}
                  aria-describedby={err('experience') ? 'e-df-experience' : undefined}
                />
                <label htmlFor="df-experience">Years of experience *</label>
                {err('experience') && <span className="field__err" id="e-df-experience">{err('experience')}</span>}
              </div>
            </div>

            <div className="form__row">
              <div className="field">
                <input
                  id="df-portfolio"
                  type="url"
                  placeholder=" "
                  value={v.portfolio}
                  onChange={(e) => setV((s) => ({ ...s, portfolio: e.target.value }))}
                />
                <label htmlFor="df-portfolio">Portfolio or GitHub link (optional)</label>
              </div>

              <div className={`field${err('availability') ? ' has-error' : ''}`}>
                <select
                  id="df-availability"
                  className={v.availability ? 'has-value' : ''}
                  value={v.availability}
                  onChange={(e) => {
                    if (status === 'error') setStatus('idle');
                    setV((s) => ({ ...s, availability: e.target.value }));
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, availability: true }))}
                  aria-invalid={!!err('availability')}
                  aria-describedby={err('availability') ? 'e-df-availability' : undefined}
                >
                  <option value="" disabled hidden></option>
                  {AVAILABILITY.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <label htmlFor="df-availability">Availability *</label>
                {err('availability') && <span className="field__err" id="e-df-availability">{err('availability')}</span>}
              </div>
            </div>

            <div className={`field${err('message') ? ' has-error' : ''}`}>
              <textarea
                id="df-message"
                rows={4}
                placeholder=" "
                value={v.message}
                onChange={(e) => {
                  if (status === 'error') setStatus('idle');
                  setV((s) => ({ ...s, message: e.target.value }));
                }}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                aria-invalid={!!err('message')}
                aria-describedby={err('message') ? 'e-df-message' : undefined}
              />
              <label htmlFor="df-message">Short message (tell us about your best work) *</label>
              {err('message') && <span className="field__err" id="e-df-message">{err('message')}</span>}
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
              <span className="btn__label">{status === 'sending' ? 'Submitting application…' : 'Submit partner application'}</span>
              <span className="btn__spinner" aria-hidden="true" />
            </button>
            <p className="form__note">
              We respect your privacy. Your information is only used for partner onboarding.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="df-success"
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
            <h3>Application Received!</h3>
            <p>
              Thanks for applying, {v.fullName.trim().split(' ')[0]}. We review partner applications within 2 business days and will be in touch.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   Main PartnerPage Component
   ========================================================================== */

export default function PartnerPage() {
  const [formType, setFormType] = useState<'company' | 'developer'>('company');

  useEffect(() => {
    const syncHash = () => {
      if (typeof window === 'undefined') return;
      const h = window.location.hash;
      if (h === '#developer-form' || h === '#developer' || h === '#become-partner') {
        setFormType('developer');
      } else if (h === '#company-form' || h === '#company') {
        setFormType('company');
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const selectForm = (type: 'company' | 'developer') => {
    setFormType(type);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', type === 'company' ? '#company-form' : '#developer-form');
    }
  };

  return (
    <ToastProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header isPartner />
      <main id="main">
        {/* 1. HERO */}
        <section className="section partner-hero">
          <div className="container">
            <div className="partner-hero__head">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">Developers &amp; Project Teams</Reveal>
              <Reveal as="h1" className="section__title" delay={0.05}>
                Developers and teams for your project.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Tell us what you need to build or ship. We match the right developers, run the delivery, and keep you updated.
              </Reveal>
              <Reveal className="partner-hero__actions" delay={0.15}>
                <MagneticButton
                  href="#partner-form"
                  variant="primary"
                  onClick={() => selectForm('company')}
                >
                  Request developers
                </MagneticButton>
                <MagneticButton
                  href="#partner-form"
                  variant="ghost"
                  onClick={() => selectForm('developer')}
                >
                  Join as a developer
                </MagneticButton>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 2. HOW WE CAN HELP */}
        <section className="section partner-help" id="how-we-help">
          <div className="container">
            <div className="section__head">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">How we can help</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                Flexible technical capacity for any stage.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Whether you need immediate help hitting a milestone or a dedicated team for an end-to-end build.
              </Reveal>
            </div>

            <div className="help-grid">
              <Reveal className="help-card" delay={0.05}>
                <div className="help-card__num">01</div>
                <h3>Extra developers for a deadline</h3>
                <p>
                  Quickly augment your existing team with senior engineers who hit the ground running to ship critical releases on time.
                </p>
              </Reveal>

              <Reveal className="help-card" delay={0.1}>
                <div className="help-card__num">02</div>
                <h3>A small team for a new product</h3>
                <p>
                  An assembled product team covering frontend, backend, and UI design to take your new software from brief to live deployment.
                </p>
              </Reveal>

              <Reveal className="help-card" delay={0.15}>
                <div className="help-card__num">03</div>
                <h3>Specialists for one part (mobile, backend, AI, automation)</h3>
                <p>
                  Targeted expertise for complex features—whether native iOS/Android mobile apps, high-throughput APIs, AI integration, or workflow automation.
                </p>
              </Reveal>

              <Reveal className="help-card" delay={0.2}>
                <div className="help-card__num">04</div>
                <h3>Ongoing monthly support</h3>
                <p>
                  Reliable engineering capacity on a monthly retainer for iterative improvements, monitoring, security updates, and maintenance.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="section partner-process" id="how-it-works">
          <div className="container">
            <div className="section__head">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">How it works</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                A clear path from brief to delivery.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Four transparent steps so your project moves quickly without ambiguity.
              </Reveal>
            </div>

            <ol className="p-steps">
              <Reveal as="li" className="p-step" delay={0.05}>
                <span className="p-step__num">01</span>
                <div className="p-step__content">
                  <h3>Tell us what you need</h3>
                  <p>Share your scope, required technologies, and timeline. No commitment required.</p>
                </div>
              </Reveal>

              <Reveal as="li" className="p-step" delay={0.1}>
                <span className="p-step__num">02</span>
                <div className="p-step__content">
                  <h3>We share a clear plan and quote</h3>
                  <p>We review your requirements and provide a structured milestone plan with a clear fixed quote.</p>
                </div>
              </Reveal>

              <Reveal as="li" className="p-step" delay={0.15}>
                <span className="p-step__num">03</span>
                <div className="p-step__content">
                  <h3>We match and start the work</h3>
                  <p>We assign the right developers tailored to your stack and begin sprint execution immediately.</p>
                </div>
              </Reveal>

              <Reveal as="li" className="p-step" delay={0.2}>
                <span className="p-step__num">04</span>
                <div className="p-step__content">
                  <h3>Regular demos and updates until delivery</h3>
                  <p>You see working software every week with progress updates until final handover and launch.</p>
                </div>
              </Reveal>
            </ol>
          </div>
        </section>

        {/* 4. WHY COMPANIES WORK WITH US */}
        <section className="section partner-why" id="why-us">
          <div className="container">
            <div className="section__head">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">Why companies work with us</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                Dependable delivery, zero guesswork.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                We prioritize clarity, technical quality, and straightforward collaboration.
              </Reveal>
            </div>

            <div className="why-grid">
              <Reveal className="why-card" delay={0.05}>
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v12M15 9.5a3.5 3.5 0 0 0-7 0c0 4 7 2 7 6a3.5 3.5 0 0 1-7 0" />
                  </svg>
                </div>
                <h3>Clear fixed quotes</h3>
                <p>Agreed scopes and fixed quotes upfront. You know exactly what you are paying for with no surprise fees.</p>
              </Reveal>

              <Reveal className="why-card" delay={0.1}>
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3>NDA available on request</h3>
                <p>Your intellectual property, product ideas, and proprietary code are strictly protected from day one.</p>
              </Reveal>

              <Reveal className="why-card" delay={0.15}>
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <h3>Regular demos</h3>
                <p>Weekly progress demos so you can review real working software and give feedback before code reaches production.</p>
              </Reveal>

              <Reveal className="why-card" delay={0.2}>
                <div className="why-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3>One point of contact</h3>
                <p>A single technical delivery lead manages sprint milestones and communication so you always have direct answers.</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 5. MERGED PARTNER FORM SECTION WITH TOGGLE */}
        <section className="section partner-form-section" id="partner-form">
          <div className="container">
            <span id="company-form" className="form-anchor" aria-hidden="true" />
            <span id="developer-form" className="form-anchor" aria-hidden="true" />

            <div className="section__head section__head--center">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">Get Started</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                Work with Valance.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Select whether you are looking to hire technical talent or apply to join our developer network.
              </Reveal>
            </div>

            {/* Toggle Switch */}
            <div className="form-toggle-wrap">
              <div className="form-toggle" role="tablist" aria-label="Select form type">
                <button
                  type="button"
                  role="tab"
                  id="tab-company"
                  aria-selected={formType === 'company'}
                  aria-controls="panel-company"
                  className={`form-toggle__btn${formType === 'company' ? ' is-active' : ''}`}
                  onClick={() => selectForm('company')}
                >
                  {formType === 'company' && (
                    <motion.span
                      layoutId="form-toggle-pill"
                      className="form-toggle__pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="form-toggle__btn-content">
                    <svg className="form-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span>Request developers</span>
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-developer"
                  aria-selected={formType === 'developer'}
                  aria-controls="panel-developer"
                  className={`form-toggle__btn${formType === 'developer' ? ' is-active' : ''}`}
                  onClick={() => selectForm('developer')}
                >
                  {formType === 'developer' && (
                    <motion.span
                      layoutId="form-toggle-pill"
                      className="form-toggle__pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="form-toggle__btn-content">
                    <svg className="form-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <span>Join as a developer</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Form Panels */}
            <div className="partner-panels-wrap">
              <div
                id="panel-company"
                role="tabpanel"
                aria-labelledby="tab-company"
                hidden={formType !== 'company'}
                style={{ display: formType === 'company' ? 'block' : 'none' }}
              >
                <CompanyForm />
              </div>

              <div
                id="panel-developer"
                role="tabpanel"
                aria-labelledby="tab-developer"
                hidden={formType !== 'developer'}
                style={{ display: formType === 'developer' ? 'block' : 'none' }}
              >
                <DeveloperForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </ToastProvider>
  );
}
