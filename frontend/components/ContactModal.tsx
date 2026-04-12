'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import content from '@/content.json';

const { site } = content;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = { name?: string; email?: string; message?: string };

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset form state every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setMessage('');
      setStatus('idle');
      setErrors({});
      // Defer focus so the element is rendered before we try to focus it
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    }
  }, [isOpen]);

  // Lock body scroll and listen for Escape
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Auto-close 2 s after a successful send
  useEffect(() => {
    if (status !== 'success') return;
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [status, onClose]);

  // Focus trap: cycle Tab/Shift-Tab within the modal
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Please enter a valid email address';
    }
    if (!message.trim()) next.message = 'Message is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    try {
      const res = await fetch('http://localhost:8000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_name: name, from_email: email, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Modal card */}
      <div
        ref={modalRef}
        className="card w-full max-w-md relative animate-fade-in"
        style={{ background: '#13111A', border: '1px solid rgba(224,64,251,0.25)' }}
        onKeyDown={handleKeyDown}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute top-4 right-4 text-[#A0A0B8] hover:text-white transition-colors duration-150"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 id="contact-modal-title" className="text-xl font-bold text-white">
            Say Hello
          </h2>
          <p className="text-[#A0A0B8] text-sm mt-1">
            Send me a message and I&apos;ll get back to you soon.
          </p>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="py-8 text-center" role="status" aria-live="polite">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-white font-medium">Message sent!</p>
            <p className="text-[#A0A0B8] text-sm mt-1">I&apos;ll get back to you soon.</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#A0A0B8' }}
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input"
                disabled={status === 'sending'}
                aria-describedby={errors.name ? 'error-name' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p id="error-name" className="text-xs mt-1" style={{ color: '#F50057' }} role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#A0A0B8' }}
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input"
                disabled={status === 'sending'}
                aria-describedby={errors.email ? 'error-email' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="error-email" className="text-xs mt-1" style={{ color: '#F50057' }} role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#A0A0B8' }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="input resize-none"
                rows={4}
                disabled={status === 'sending'}
                aria-describedby={errors.message ? 'error-message' : undefined}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p id="error-message" className="text-xs mt-1" style={{ color: '#F50057' }} role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div
                className="mb-4 px-4 py-3 rounded-md text-sm"
                style={{
                  background: 'rgba(245,0,87,0.08)',
                  border: '1px solid rgba(245,0,87,0.3)',
                  color: '#F50057',
                }}
                role="alert"
                aria-live="assertive"
              >
                Something went wrong. Try emailing directly at{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="underline hover:opacity-80 transition-opacity"
                >
                  {site.email}
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
                disabled={status === 'sending'}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
