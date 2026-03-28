'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import PageTransition from '@/components/ui/PageTransition';
import SectionHeading from '@/components/ui/SectionHeading';
import { EVENT_TYPES } from '@/lib/constants';
import type { ClientReview } from '@/types/database';

export default function ReviewsPage() {
  const [approved, setApproved] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    client_name: '',
    email: '',
    event_type: '',
    quote: '',
    rating: 5,
  });

  useEffect(() => {
    fetch('/api/reviews?status=approved')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setApproved(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ client_name: '', email: '', event_type: '', quote: '', rating: 5 });
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <PageTransition>
          <main className="pt-20">
            <section className="relative py-32 md:py-40 bg-background">
              <div className="max-w-5xl mx-auto px-6 md:px-12">
                <SectionHeading
                  label="Feedback"
                  title="Client Reviews"
                  subtitle="Hear from those who trusted us — and share your own experience"
                  titleLevel="h1"
                />

                <div className="text-center mb-16">
                  <button
                    onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
                    className="font-accent text-xs tracking-[0.2em] uppercase px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-background rounded-[3px] transition-all duration-300"
                    data-cursor="pointer"
                  >
                    {showForm ? 'Close' : 'Write a Review'}
                  </button>
                </div>

                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-20"
                    >
                      {submitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-12 border border-border rounded-[3px] bg-surface"
                        >
                          <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                          <p className="font-display text-2xl text-foreground mb-2">Thank You!</p>
                          <p className="text-muted text-sm">Your review has been submitted and is awaiting approval.</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="border border-border rounded-[3px] bg-surface p-8 space-y-5 max-w-2xl mx-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              required
                              placeholder="Your Name"
                              value={form.client_name}
                              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                              className="w-full bg-background border border-border rounded-[3px] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-gold/50 transition-colors outline-none"
                            />
                            <input
                              required
                              type="email"
                              placeholder="Email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full bg-background border border-border rounded-[3px] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-gold/50 transition-colors outline-none"
                            />
                          </div>
                          <select
                            value={form.event_type}
                            onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                            className="w-full bg-background border border-border rounded-[3px] px-4 py-3 text-sm text-foreground focus:border-gold/50 transition-colors outline-none"
                          >
                            <option value="">Event Type (optional)</option>
                            {EVENT_TYPES.map((et) => (
                              <option key={et} value={et}>{et}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted">Rating:</span>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setForm({ ...form, rating: n })}
                                className={`text-lg transition-colors ${n <= form.rating ? 'text-gold' : 'text-muted-dark'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <textarea
                            required
                            rows={4}
                            placeholder="Tell us about your experience..."
                            value={form.quote}
                            onChange={(e) => setForm({ ...form, quote: e.target.value })}
                            className="w-full bg-background border border-border rounded-[3px] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-gold/50 transition-colors outline-none resize-none"
                          />
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full font-accent text-xs tracking-[0.2em] uppercase py-3.5 bg-gold text-background rounded-[3px] hover:bg-gold-accent transition-colors disabled:opacity-50"
                          >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : approved.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted">No reviews yet — be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {approved.map((review, i) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(i * 0.08, 0.4) }}
                        className="p-8 bg-surface border border-border rounded-[3px] relative"
                      >
                        <span className="absolute top-4 right-6 font-display text-6xl text-gold/10 leading-none select-none">
                          &ldquo;
                        </span>
                        <div className="flex gap-0.5 mb-3 text-gold text-sm">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span key={n}>{n <= review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <p className="text-foreground text-base leading-relaxed mb-6 relative z-10">
                          &ldquo;{review.quote}&rdquo;
                        </p>
                        <div className="gold-line mb-4" />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-display text-gold text-lg">
                            {review.client_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-display text-lg text-foreground">{review.client_name}</p>
                            {review.event_type && (
                              <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-gold mt-0.5">
                                {review.event_type}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </PageTransition>
        <Footer />
      </SmoothScroll>
    </>
  );
}
