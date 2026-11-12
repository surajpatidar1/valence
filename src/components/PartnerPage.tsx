import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackToTop from './BackToTop';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';
import { ToastProvider, useToast } from './Toast';
import { CONTACT } from '../data/contact';

const HELP_OPTIONS = [
  {
    title: 'Extra developers for a deadline',
    text: 'Quickly augment your existing team with senior engineers who hit the ground running to ship critical releases on time.',
  },
  {
    title: 'A small team for a new product',
    text: 'An assembled product team covering frontend, backend, and UI design to take your new software from brief to live deployment.',
  },
  {
    title: 'Specialists for one part of the build',
    text: 'Targeted expertise for complex features: native iOS/Android apps, high-throughput APIs, AI integration, or workflow automation.',
  },
  {
    title: 'Ongoing monthly support',
    text: 'Reliable engineering capacity on a monthly retainer for iterative improvements, monitoring, security updates, and maintenance.',
  },
];

const PROCESS_STEPS = [
  { title: 'Tell us what you need', text: 'Share your scope, required technologies, and timeline. No commitment required.' },
  { title: 'Get a clear plan and quote', text: 'We review your requirements and provide a structured milestone plan with a clear fixed quote.' },
  { title: 'We match and start', text: 'We assign the right developers for your stack and begin sprint execution.' },
  { title: 'Demos until delivery', text: 'You see working software every week, with progress updates until final handover and launch.' },
];

const WHY_POINTS = [
  {
    title: 'Clear fixed quotes',
    text: 'Agreed scope and a fixed quote upfront. You know exactly what you are paying for, with no surprise fees.',
    icon: <><path d="M7 3h10v18l-2.5-1.6L12 21l-2.5-1.6L7 21z" /><path d="M10 8h4M10 12h4" /></>,
  },
  {
    title: 'NDA available on request',
    text: 'Your intellectual property, product ideas, and proprietary code are protected from day one.',
    icon: <><path d="M12 3 5 6v5c0 4.5 3 8.3 7 9.5 4-1.2 7-5 7-9.5V6z" /><path d="m9.5 12 1.8 1.8 3.5-3.6" /></>,
  },
  {
    title: 'Regular demos',
    text: 'Weekly demos so you can review real working software and give feedback before it reaches production.',
    icon: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4M10.5 8.2v4.6L14.5 10.5z" /></>,
  },
  {
    title: 'One point of contact',
    text: 'A single delivery lead manages milestones and communication, so you always get direct answers.',
    icon: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" /></>,
  },
];

const NEED_OPTIONS = ['Extra developers', 'A small team', 'A specialist', 'Ongoing support', 'Not sure yet'];
const DEV_SKILLS = ['Frontend', 'Backend', 'Mobile', 'AI / LLM', 'Automation', 'Design', 'Other'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** True when an endpoint has been filled in (not empty and not a [PLACEHOLDER]). */
const isConfigured = (url?: string) => !!url && !url.trim().startsWith('[');

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Sends the form to `endpoint` if configured; otherwise opens the visitor's
 * email app with the message pre-filled so no enquiry is ever lost.
 */
async function sendForm(endpoint: string | undefined, payload: Record<string, string>, subject: string): Promise<'sent' | 'mailto'> {
  if (!isConfigured(endpoint)) {
    const body = Object.entries(payload)
      .filter(([, val]) => val)
      .map(([k, val]) => `${k}: ${val}`)
      .join('\n');
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return 'mailto';
  }
  const res = await fetch(endpoint!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return 'sent';
}

/* Shared floating-label field */
function Field({
  id, label, value, onChange, onBlur, error, type = 'text', autoComplete, textarea,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; onBlur?: () => void;
  error?: string; type?: string; autoComplete?: string; textarea?: boolean;
}) {
  const common = {
    id,
    placeholder: ' ',
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    onBlur,
    'aria-invalid': !!error,
    'aria-describedby': error ? `e-${id}` : undefined,
  };
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      {textarea ? <textarea rows={4} {...common} /> : <input type={type} autoComplete={autoComplete} {...common} />}
      <label htmlFor={id}>{label}</label>
      {error && <span className="field__err" id={`e-${id}`}>{error}</span>}
    </div>
  );
}

/* Single-choice chip group */
function ChoiceChips({
  legend, hint, options, value, onChange, error, id,
}: {
  legend: string; hint?: string; options: string[]; value: string; onChange: (v: string) => void; error?: string; id: string;
}) {
  return (
    <fieldset className={`chips chips--skills${error ? ' has-error' : ''}`} id={id} tabIndex={-1} aria-describedby={error ? `e-${id}` : undefined}>
      <legend>{legend} {hint && <span>{hint}</span>}</legend>
      <div className="chips__group">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            className={`chip-btn${value === o ? ' is-active' : ''}`}
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? '' : o)}
          >
            {o}
          </button>
        ))}
      </div>
      {error && <span className="field__err" id={`e-${id}`}>{error}</span>}
    </fieldset>
  );
}

function SuccessCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div
      key="success"
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
      <h3>{title}</h3>
      <p>{children}</p>
    </motion.div>
  );
}

function ErrorAlert() {
  return (
    <div className="form__alert form__alert--error" role="alert">
      <strong>Something went wrong.</strong>
      <span> Please try again or email us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</span>
    </div>
  );
}

/* ==========================================================================
   Company Request Form
   ========================================================================== */

type CompanyValues = { name: string; email: string; company: string; need: string; details: string; _gotcha: string };

function validateCompany(v: CompanyValues) {
  const e: Partial<Record<keyof CompanyValues, string>> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.details.trim().length < 10) e.details = 'A sentence or two about the project is enough.';
  return e;
}

function CompanyForm() {
  const toast = useToast();
  const [v, setV] = useState<CompanyValues>({ name: '', email: '', company: '', need: '', details: '', _gotcha: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof CompanyValues, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const errors = validateCompany(v);
  const err = (k: keyof CompanyValues) => (touched[k] ? errors[k] : undefined);
  const set = (k: keyof CompanyValues) => (val: string) => {
    if (status === 'error') setStatus('idle');
    setV((s) => ({ ...s, [k]: val }));
  };
  const blur = (k: keyof CompanyValues) => () => setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, details: true });
    const keys = Object.keys(errors);
    if (keys.length) {
      document.getElementById(`cf-${keys[0]}`)?.focus();
      return;
    }
    if (v._gotcha) return setStatus('sent');

    setStatus('sending');
    try {
      const result = await sendForm(
        CONTACT.companyRequestEndpoint,
        { type: 'Developer request', name: v.name, email: v.email, company: v.company, need: v.need || 'Not specified', details: v.details },
        `Developer request${v.company ? ` from ${v.company}` : ''}`,
      );
      setStatus(result === 'sent' ? 'sent' : 'idle');
    } catch {
      setStatus('error');
      toast(`Unable to send. Please email us at ${CONTACT.email}.`);
    }
  };

  return (
    <div className="partner-form-wrap">
      <AnimatePresence mode="wait">
        {status !== 'sent' ? (
          <motion.form key="c-form" className="form partner-form" noValidate onSubmit={handleSubmit} exit={{ opacity: 0, scale: 0.97 }}>
            <div className="partner-form__intro">
              <h3>Request developers</h3>
              <p>Tell us briefly what you’re building. We’ll reply with next steps.</p>
            </div>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="cf-gotcha">Leave this empty</label>
              <input id="cf-gotcha" type="text" tabIndex={-1} autoComplete="off" value={v._gotcha} onChange={(e) => set('_gotcha')(e.target.value)} />
            </div>

            <div className="form__row">
              <Field id="cf-name" label="Your name" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} error={err('name')} />
              <Field id="cf-email" label="Work email" type="email" autoComplete="email" value={v.email} onChange={set('email')} onBlur={blur('email')} error={err('email')} />
            </div>
            <Field id="cf-company" label="Company (optional)" autoComplete="organization" value={v.company} onChange={set('company')} />

            <ChoiceChips id="cf-need" legend="What do you need?" hint="(optional)" options={NEED_OPTIONS} value={v.need} onChange={set('need')} />

            <Field id="cf-details" label="About the project" textarea value={v.details} onChange={set('details')} onBlur={blur('details')} error={err('details')} />

            {status === 'error' && <ErrorAlert />}

            <button type="submit" className={`btn btn--primary btn--block${status === 'sending' ? ' is-loading' : ''}`} disabled={status === 'sending'}>
              <span className="btn__label">{status === 'sending' ? 'Sending…' : 'Send request'}</span>
              <span className="btn__spinner" aria-hidden="true" />
            </button>
            <p className="form__note">{CONTACT.responseTime} NDA available on request.</p>
          </motion.form>
        ) : (
          <SuccessCard title="Request received">
            Thanks, {v.name.trim().split(' ')[0]}. {CONTACT.responseTime}
          </SuccessCard>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================================
   Developer Application Form
   ========================================================================== */

type DevValues = { name: string; email: string; skill: string; portfolio: string; message: string; _gotcha: string };

function validateDev(v: DevValues) {
  const e: Partial<Record<keyof DevValues, string>> = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.skill) e.skill = 'Please choose your main skill.';
  return e;
}

function DeveloperForm() {
  const toast = useToast();
  const [v, setV] = useState<DevValues>({ name: '', email: '', skill: '', portfolio: '', message: '', _gotcha: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof DevValues, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const errors = validateDev(v);
  const err = (k: keyof DevValues) => (touched[k] ? errors[k] : undefined);
  const set = (k: keyof DevValues) => (val: string) => {
    if (status === 'error') setStatus('idle');
    setV((s) => ({ ...s, [k]: val }));
  };
  const blur = (k: keyof DevValues) => () => setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, skill: true });
    const keys = Object.keys(errors);
    if (keys.length) {
      document.getElementById(`df-${keys[0]}`)?.focus();
      return;
    }
    if (v._gotcha) return setStatus('sent');

    setStatus('sending');
    try {
      const result = await sendForm(
        CONTACT.partnerFormEndpoint,
        { type: 'Developer application', name: v.name, email: v.email, skill: v.skill, portfolio: v.portfolio, message: v.message },
        `Developer application: ${v.skill} (${v.name})`,
      );
      setStatus(result === 'sent' ? 'sent' : 'idle');
    } catch {
      setStatus('error');
      toast(`Unable to send. Please email us at ${CONTACT.email}.`);
    }
  };

  return (
    <div className="partner-form-wrap">
      <AnimatePresence mode="wait">
        {status !== 'sent' ? (
          <motion.form key="d-form" className="form partner-form" noValidate onSubmit={handleSubmit} exit={{ opacity: 0, scale: 0.97 }}>
            <div className="partner-form__intro">
              <h3>Join our developer network</h3>
              <p>Share a few details and a link to your work. We’ll be in touch when there’s a good fit.</p>
            </div>

            <div className="hp-field" aria-hidden="true">
              <label htmlFor="df-gotcha">Leave this empty</label>
              <input id="df-gotcha" type="text" tabIndex={-1} autoComplete="off" value={v._gotcha} onChange={(e) => set('_gotcha')(e.target.value)} />
            </div>

            <div className="form__row">
              <Field id="df-name" label="Your name" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} error={err('name')} />
              <Field id="df-email" label="Email" type="email" autoComplete="email" value={v.email} onChange={set('email')} onBlur={blur('email')} error={err('email')} />
            </div>

            <ChoiceChips id="df-skill" legend="Main skill" options={DEV_SKILLS} value={v.skill} onChange={(val) => { set('skill')(val); setTouched((t) => ({ ...t, skill: true })); }} error={err('skill')} />

            <Field id="df-portfolio" label="Portfolio, GitHub or LinkedIn (optional)" type="url" autoComplete="url" value={v.portfolio} onChange={set('portfolio')} />
            <Field id="df-message" label="Anything else we should know? (optional)" textarea value={v.message} onChange={set('message')} />

            {status === 'error' && <ErrorAlert />}

            <button type="submit" className={`btn btn--primary btn--block${status === 'sending' ? ' is-loading' : ''}`} disabled={status === 'sending'}>
              <span className="btn__label">{status === 'sending' ? 'Sending…' : 'Apply to join'}</span>
              <span className="btn__spinner" aria-hidden="true" />
            </button>
            <p className="form__note">Your details are only used to review your application.</p>
          </motion.form>
        ) : (
          <SuccessCard title="Application received">
            Thanks, {v.name.trim().split(' ')[0]}. We’ll review your details and get back to you.
          </SuccessCard>
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
          <div className="container help-layout">
            <div className="help-layout__intro">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">How we can help</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                Flexible technical capacity for any stage.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                Whether you need immediate help hitting a milestone or a dedicated team for an end-to-end build.
              </Reveal>
            </div>

            <ol className="help-list">
              {HELP_OPTIONS.map((o, i) => (
                <Reveal as="li" className="help-row" key={o.title} delay={i * 0.06}>
                  <span className="help-row__num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="help-row__body">
                    <h3>{o.title}</h3>
                    <p>{o.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
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

            <div className="timeline">
              <div className="timeline__track" aria-hidden="true">
                <motion.span
                  className="timeline__fill"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  whileInView={{ scaleX: 1, scaleY: 1 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                />
              </div>
              <ol className="timeline__steps">
                {PROCESS_STEPS.map((st, i) => (
                  <motion.li
                    className="timeline__step"
                    key={st.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="timeline__node">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{st.title}</h3>
                    <p>{st.text}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 4. WHY COMPANIES WORK WITH US */}
        <section className="section partner-why" id="why-us">
          <div className="container">
            <div className="section__head section__head--light">
              <Reveal as="p" className="eyebrow eyebrow--no-counter">Why companies work with us</Reveal>
              <Reveal as="h2" className="section__title" delay={0.05}>
                Dependable delivery, zero guesswork.
              </Reveal>
              <Reveal as="p" className="section__lead" delay={0.1}>
                We prioritize clarity, technical quality, and straightforward collaboration.
              </Reveal>
            </div>

            <ul className="why-list">
              {WHY_POINTS.map((w, i) => (
                <Reveal as="li" className="why-item" key={w.title} delay={i * 0.08}>
                  <svg className="why-item__icon" viewBox="0 0 24 24" aria-hidden="true">{w.icon}</svg>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </Reveal>
              ))}
            </ul>
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
