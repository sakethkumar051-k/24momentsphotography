'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${alignment} mb-16 md:mb-20`}
    >
      {label && (
        <span className="font-accent text-xs tracking-[0.3em] uppercase text-gold mb-4">
          {label}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-6 w-16 h-px bg-gold" />
    </motion.div>
  );
}
