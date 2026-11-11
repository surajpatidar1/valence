import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import Reveal from './Reveal';
import { useToast } from './Toast';
import { CONTACT } from '../data/contact';

const TOPICS = ['Website', 'Mobile app', 'SEO', 'Automation', 'AI / LLM', 'Not sure yet'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.message.trim().length < 10) e.message = 'A sentence or two is enough.';
  return e;
}

type Channel = { href: string; label: string; value: string; icon: ReactNode; external?: boolean };

const CHANNELS: Channel[] = [
  CONTACT.email && {
    href: `mailto:${CONTACT.email}`,
    label: 'Email us',
    value: CONTACT.email,
    icon: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  },
  CONTACT.whatsapp && {
    href: `https://wa.me/${CONTACT.whatsapp}`,
    label: 'Chat on WhatsApp',
    value: 'Quick questions, fast replies',
    icon: <path d="M5 19l1.2-3.6A7.5 7.5 0 1 1 9 18.2L5 19ZM9.5 9.5c.3 1.8 2.2 3.8 4 4.2l1-1 1.6.7-.3 1.4c-3.3.3-7-3.4-6.6-6.6l1.4-.3.7 1.6-1 1Z" />,
    external: true,
  },
  CONTACT.bookingUrl && {
    href: CONTACT.bookingUrl,
    label: 'Book a free call',
    value: 'Pick a time that suits you',
    icon: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
    external: true,
  },
].filter(Boolean) as Channel[];

export default function Contact() {
  const toast = useToast();
  const [topic, setTopic] = useState<string | null>(null);

  useEffect(() => {
    const onTopicSelect = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail && TOPICS.includes(detail)) {
        setTopic(detail);
      }
    };
    window.addEventListener('select-contact-topic', onTopicSelect);
    return () => window.removeEventListener('select-contact-topic', onTopicSelect);
  }, []);

  const [v, setV] = useState<Values>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const errors = validate(v);
  const err = (k: keyof Values) => (touched[k] ? errors[k] : undefined);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const keys = Object.keys(errors) as (keyof Values)[];
    if (keys.length) {
      document.getElementById(`f-${keys[0]}`)?.focus();
      return;
    }

    const payload = { ...v, topic: topic ?? 'Not specified' };

    setStatus('sending');
    try {
      const endpoint = CONTACT.formEndpoint || `mailto:${CONTACT.email}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
      toast(`Something went wrong. Please email us directly at ${CONTACT.email}.`);
    }
  };

  const field = (k: keyof Values, label: string, opts: { type?: string; auto?: string; area?: boolean } = {}) => {
    const props = {
      id: `f-${k}`,
      placeholder: ' ',
      value: v[k],
      onChange: (e: { target: { value: string } }) => {
        if (status === 'error') setStatus('idle');
        setV((s) => ({ ...s, [k]: e.target.value }));
      },
      onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
      'aria-invalid': !!err(k),
      'aria-describedby': err(k) ? `e-${k}` : undefined,
    };
    return (
      <div className={`field${err(k) ? ' has-error' : ''}`}>
        {opts.area ? <textarea rows={4} {...props} /> : <input type={opts.type ?? 'text'} autoComplete={opts.auto} {...props} />}
        <label htmlFor={`f-${k}`}>{label}</label>
        {err(k) && <span className="field__err" id={`e-${k}`}>{err(k)}</span>}
      </div>
    );
  };

  return (
    <section className="section contact" id="contact">
      <div className="container contact__inner">
        <div className="contact__copy">
          <Reveal as="p" className="eyebrow">Let’s talk</Reveal>
          <Reveal as="h2" className="section__title" delay={0.05}>Tell us about your project.</Reveal>
          <Reveal as="p" className="section__lead" delay={0.1}>
            No long forms, no commitment. Send a short message or reach us directly, and we’ll take it from there.
          </Reveal>

          <Reveal className="channels" delay={0.15}>
            {CHANNELS.map((c) => (
              <a key={c.label} className="channel" href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="channel__icon" aria-hidden="true"><svg viewBox="0 0 24 24">{c.icon}</svg></span>
                <span className="channel__text">
                  <b>{c.label}</b>
                  <small>{c.value}</small>
                </span>
                <span className="channel__arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </Reveal>
        </div>

        <Reveal className="form-wrap" delay={0.1}>
          <AnimatePresence mode="wait">
            {status !== 'sent' ? (
              <motion.form key="form" className="form" noValidate onSubmit={submit} exit={{ opacity: 0, scale: 0.97 }}>
                <fieldset className="chips">
                  <legend>What can we help with? <span>(optional)</span></legend>
                  {TOPICS.map((t) => (
                    <label key={t}>
                      <input
                        type="radio"
                        name="topic"
                        checked={topic === t}
                        onChange={() => setTopic(t)}
                        onClick={() => topic === t && setTopic(null)}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="form__row">
                  {field('name', 'Your name', { auto: 'name' })}
                  {field('email', 'Email address', { type: 'email', auto: 'email' })}
                </div>
                {field('message', 'Briefly, what are you looking for?', { area: true })}

                {status === 'error' && (
                  <div className="form__alert form__alert--error" role="alert">
                    <strong>Unable to send message right now.</strong>
                    <span> Please try again or email us directly at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn--primary btn--block${status === 'sending' ? ' is-loading' : ''}`}
                  disabled={status === 'sending'}
                >
                  <span className="btn__label">{status === 'sending' ? 'Sending…' : 'Send message'}</span>
                  <span className="btn__spinner" aria-hidden="true" />
                </button>
                <p className="form__note">
                  {CONTACT.responseTime} Your details are only used to reply to you.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="ok"
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
                <h3>Thanks, {v.name.trim().split(' ')[0]}.</h3>
                <p>Your message is on its way. {CONTACT.responseTime}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
