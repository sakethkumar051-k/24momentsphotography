'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { EVENT_TYPES, REFERRAL_SOURCES } from '@/lib/constants';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  location: string;
  message: string;
  referral_source: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    location: '',
    message: '',
    referral_source: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send message');
      setSuccess(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        event_type: '',
        event_date: '',
        location: '',
        message: '',
        referral_source: '',
      });
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-32 md:py-40 bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <SectionHeading
          label="Get in Touch"
          title="Book Your Session"
          subtitle="Tell us about your vision and let's create something extraordinary together"
        />

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-8"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </motion.div>
              <h3 className="font-display text-3xl text-foreground mb-4">Message Sent</h3>
              <p className="text-muted">We&apos;ll get back to you within 24 hours.</p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setSuccess(false)}
              >
                Send Another
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone"
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 99999 99999"
                />
                <div className="space-y-2">
                  <label
                    htmlFor="event_type"
                    className="block text-sm font-accent tracking-wider uppercase text-muted"
                  >
                    Event Type
                  </label>
                  <select
                    id="event_type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface border border-border rounded-[3px] px-4 py-3 text-foreground transition-all duration-300 focus:border-gold focus:ring-1 focus:ring-gold/30 appearance-none"
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Event Date"
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                />
                <Input
                  label="Location"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City or venue"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-accent tracking-wider uppercase text-muted"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your vision..."
                  className="w-full bg-surface border border-border rounded-[3px] px-4 py-3 text-foreground placeholder:text-muted-dark transition-all duration-300 focus:border-gold focus:ring-1 focus:ring-gold/30 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="referral_source"
                  className="block text-sm font-accent tracking-wider uppercase text-muted"
                >
                  How did you hear about us?
                </label>
                <select
                  id="referral_source"
                  name="referral_source"
                  value={formData.referral_source}
                  onChange={handleChange}
                  className="w-full bg-surface border border-border rounded-[3px] px-4 py-3 text-foreground transition-all duration-300 focus:border-gold focus:ring-1 focus:ring-gold/30 appearance-none"
                >
                  <option value="">Select an option</option>
                  {REFERRAL_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <div className="pt-4 text-center">
                <Button type="submit" size="lg" loading={loading}>
                  Send Message
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
