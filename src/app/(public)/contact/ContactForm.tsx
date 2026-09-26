'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import styles from '@/components/contact/contact.module.css';

type FieldName = 'name' | 'email' | 'subject' | 'message';
type Errors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: Record<FieldName, string>): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Please enter your name.';
  if (!data.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = 'Enter a valid email address.';
  if (!data.subject.trim()) errors.subject = 'Please enter a subject.';
  if (!data.message.trim()) errors.message = 'Please enter a message.';
  return errors;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    // Front-end only for now — wire this up to the support inbox once the endpoint exists.
    window.setTimeout(() => {
      setPending(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className={styles.formCard} data-course-reveal data-reveal-variant="card">
      <h2><MessageSquare size={19} /> Send us a message</h2>
      <p>Tell us what you need help with — a real person from our support team will reply.</p>

      {submitted ? (
        <div className={styles.formSuccess}>
          <CheckCircle2 size={18} /> Thanks! Your message is on its way — we&apos;ll reply within 2 hours.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="c-name">Your name</label>
              <input
                id="c-name"
                name="name"
                placeholder="John Doe"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'c-name-error' : undefined}
                data-invalid={!!errors.name}
                onChange={() => clearError('name')}
              />
              {errors.name && <span id="c-name-error" className={styles.fieldError}>{errors.name}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="c-email">Email address</label>
              <input
                id="c-email"
                name="email"
                type="email"
                placeholder="john@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'c-email-error' : undefined}
                data-invalid={!!errors.email}
                onChange={() => clearError('email')}
              />
              {errors.email && <span id="c-email-error" className={styles.fieldError}>{errors.email}</span>}
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="c-subject">Subject</label>
            <input
              id="c-subject"
              name="subject"
              placeholder="e.g. Query about PSC Clerkship mock test"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'c-subject-error' : undefined}
              data-invalid={!!errors.subject}
              onChange={() => clearError('subject')}
            />
            {errors.subject && <span id="c-subject-error" className={styles.fieldError}>{errors.subject}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              placeholder="Describe your query in detail..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'c-message-error' : undefined}
              data-invalid={!!errors.message}
              onChange={() => clearError('message')}
            />
            {errors.message && <span id="c-message-error" className={styles.fieldError}>{errors.message}</span>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={pending}>
            {pending ? 'Sending…' : 'Submit message'}
          </button>
          <p className={styles.formNote}>We typically reply within 2 hours on working days.</p>
        </form>
      )}
    </div>
  );
}
