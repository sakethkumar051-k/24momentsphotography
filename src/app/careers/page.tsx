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

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data.filter((j: JobPosting) => j.active));
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
          <main className="pt-20">
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
                          onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
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
                                <p className="text-muted text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                                <a
                                  href="/contact"
                                  className="inline-block mt-6 font-accent text-xs tracking-[0.2em] uppercase text-gold hover:text-gold-accent transition-colors"
                                >
                                  Apply via Contact →
                                </a>
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
