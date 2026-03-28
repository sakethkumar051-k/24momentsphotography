'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import PageTransition from '@/components/ui/PageTransition';
import SectionHeading from '@/components/ui/SectionHeading';
import type { JobPosting } from '@/types/database';

const inputClass =
  'w-full bg-background border border-border rounded-[3px] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-gold/50 transition-colors outline-none';

function ApplyForm({ job, onClose }: { job: JobPosting; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', portfolio_url: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, job_id: job.id, job_title: job.title }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
        <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="font-display text-xl text-foreground mb-1">Application Sent!</p>
        <p className="text-muted text-sm">We&apos;ll review your application and get back to you soon.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-gold">
        Apply for {job.title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
        <input placeholder="Portfolio / Website URL" value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} className={inputClass} />
      </div>
      <textarea
        rows={3}
        placeholder="Tell us about yourself and why you'd be a great fit..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={`${inputClass} resize-none`}
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="font-accent text-xs tracking-[0.2em] uppercase px-6 py-3 bg-gold text-background rounded-[3px] hover:bg-gold-accent transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-accent text-xs tracking-[0.2em] uppercase px-6 py-3 border border-border text-muted rounded-[3px] hover:text-foreground hover:border-gold/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data.filter((j: JobPosting) => j.active);
          const seen = new Set<string>();
          const deduped = active.filter((j: JobPosting) => {
            const key = `${j.title}::${j.location}::${j.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setJobs(deduped);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <Navbar />
        <PageTransition>
          <main className="pt-24">
            <section className="relative py-32 md:py-40 bg-background">
              <div className="max-w-4xl mx-auto px-6 md:px-12">
                <SectionHeading
                  label="Join Us"
                  title="Careers"
                  subtitle="Be part of a team that captures extraordinary moments"
                  titleLevel="h1"
                />

                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : jobs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <p className="text-muted text-lg mb-2">No open positions right now</p>
                    <p className="text-muted text-sm">Check back soon — we&apos;re always growing!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job, i) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="border border-border rounded-[3px] overflow-hidden bg-surface hover:border-gold/30 transition-colors"
                      >
                        <button
                          onClick={() => {
                            setExpandedId(expandedId === job.id ? null : job.id);
                            setApplyingId(null);
                          }}
                          className="w-full text-left p-6 flex items-center justify-between gap-4"
                          data-cursor="pointer"
                        >
                          <div>
                            <h3 className="font-display text-xl text-foreground">{job.title}</h3>
                            <div className="flex gap-3 mt-2 text-xs text-muted">
                              <span className="font-accent tracking-wider uppercase">{job.location}</span>
                              <span className="text-gold">·</span>
                              <span className="capitalize">{job.type}</span>
                            </div>
                          </div>
                          <motion.svg
                            animate={{ rotate: expandedId === job.id ? 180 : 0 }}
                            width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold shrink-0"
                          >
                            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </motion.svg>
                        </button>
                        <AnimatePresence>
                          {expandedId === job.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <div className="gold-line mb-4" />
                                <p className="text-muted text-sm leading-relaxed whitespace-pre-line mb-6">{job.description}</p>

                                {applyingId === job.id ? (
                                  <ApplyForm job={job} onClose={() => setApplyingId(null)} />
                                ) : (
                                  <button
                                    onClick={() => setApplyingId(job.id)}
                                    className="font-accent text-xs tracking-[0.2em] uppercase px-6 py-3 bg-gold text-background rounded-[3px] hover:bg-gold-accent transition-colors"
                                    data-cursor="pointer"
                                  >
                                    Apply Now
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
