'use client';

import React, { useState } from 'react';
import { COMPANY_FACTS } from '../config/companyFacts';

const DEPARTMENTS = [
  'Product Support',
  'Billing',
  'Enterprise',
  'Partnerships',
  'Privacy',
  'Legal',
  'Press',
  'General Enquiries',
] as const;

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState<typeof DEPARTMENTS[number]>('Product Support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('Please enter a subject line.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg('Please enter a message of at least 10 characters.');
      return;
    }
    if (message.length > 2000) {
      setErrorMsg('Message is too long. Please keep under 2,000 characters.');
      return;
    }
    if (!consent) {
      setErrorMsg('Please acknowledge consent to process your enquiry.');
      return;
    }

    setErrorMsg('');

    // Transparent Email Client Handoff (No fake backend simulation)
    const formattedSubject = encodeURIComponent(`[${department}] ${subject.trim()}`);
    const bodyContent = encodeURIComponent(
      `Name: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Company: ${company.trim() || 'N/A'}\n` +
      `Department: ${department}\n\n` +
      `Message:\n${message.trim()}\n`
    );

    const mailtoUrl = `mailto:${COMPANY_FACTS.supportEmail}?subject=${formattedSubject}&body=${bodyContent}`;
    window.location.href = mailtoUrl;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#0c101a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Send Us a Direct Inquiry</h2>
        <p className="text-xs text-slate-400">
          All department inquiries are routed directly to our verified team mailbox at{' '}
          <strong className="text-amber-400">{COMPANY_FACTS.supportEmail}</strong>.
        </p>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-300">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-xs font-bold text-slate-300">
            Your Name <span className="text-amber-400">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full h-11 px-4 rounded-xl bg-[#05070c] border border-slate-800 focus:border-amber-400 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-bold text-slate-300">
            Email Address <span className="text-amber-400">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className="w-full h-11 px-4 rounded-xl bg-[#05070c] border border-slate-800 focus:border-amber-400 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company */}
        <div className="space-y-1.5">
          <label htmlFor="contact-company" className="block text-xs font-bold text-slate-300">
            Company Name <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
            className="w-full h-11 px-4 rounded-xl bg-[#05070c] border border-slate-800 focus:border-amber-400 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
          />
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label htmlFor="contact-department" className="block text-xs font-bold text-slate-300">
            Target Department <span className="text-amber-400">*</span>
          </label>
          <select
            id="contact-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value as typeof DEPARTMENTS[number])}
            className="w-full h-11 px-4 rounded-xl bg-[#05070c] border border-slate-800 focus:border-amber-400 text-xs text-slate-100 outline-none transition-colors cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-[#0c101a] text-slate-100">
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-300">
          Subject Line <span className="text-amber-400">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of your enquiry"
          className="w-full h-11 px-4 rounded-xl bg-[#05070c] border border-slate-800 focus:border-amber-400 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors"
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <label htmlFor="contact-message">
            Message <span className="text-amber-400">*</span>
          </label>
          <span className="text-[11px] font-mono text-slate-500 font-normal">
            {message.length} / 2000 chars
          </span>
        </div>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please detail your question or inquiry..."
          className="w-full p-4 rounded-xl bg-[#05070c] border border-slate-800 focus:border-amber-400 text-xs text-slate-100 placeholder-slate-600 outline-none transition-colors resize-y"
        />
      </div>

      {/* Consent Checkbox */}
      <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#05070c] p-4 text-xs text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-amber-500 rounded"
        />
        <span>
          I acknowledge that submitting this enquiry will launch my default email client to send an email directly to{' '}
          <strong className="text-amber-400 font-mono">{COMPANY_FACTS.supportEmail}</strong>.
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!consent}
        className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
      >
        <span>Prepare & Send Support Email</span>
        <span>→</span>
      </button>
    </form>
  );
}
