'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const icons: Record<string, React.ReactNode> = {
  heart: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  trophy: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 1012 0V2z" />
    </svg>
  ),
  building: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01" />
    </svg>
  ),
  user: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  book: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
};

const defaultServices = [
  {
    title: 'Wedding Photography',
    description: 'Timeless coverage of your most important day. From preparation to reception, every moment preserved with cinematic elegance.',
    icon: 'heart',
  },
  {
    title: 'Sports Events',
    description: 'High-speed, high-impact photography that captures the raw energy and decisive moments of athletic competition.',
    icon: 'trophy',
  },
  {
    title: 'Corporate Events',
    description: 'Professional coverage for conferences, galas, product launches, and corporate milestones.',
    icon: 'building',
  },
  {
    title: 'Portrait Sessions',
    description: 'Individual, couple, or family portraits crafted with studio precision or natural-light artistry.',
    icon: 'user',
  },
  {
    title: 'Albums & Prints',
    description: 'Museum-quality prints and handcrafted albums that transform your photographs into tangible heirlooms.',
    icon: 'book',
  },
];

export default function Services() {
  return (
    <section className="relative py-32 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          label="Services"
          title="What We Offer"
          subtitle="Comprehensive photography solutions tailored to your vision"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative p-8 bg-surface rounded-[3px] border border-border hover:border-gold/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3px]" />

              <div className="relative">
                <div className="text-gold mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  {icons[service.icon] || icons.user}
                </div>

                <h3 className="font-display text-2xl text-foreground mb-3">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{service.description}</p>

                <div className="gold-line mt-6" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
