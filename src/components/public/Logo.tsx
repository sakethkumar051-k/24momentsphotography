'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export default function Logo({ size = 'md', animate = false }: LogoProps) {
  const sizes = {
    sm: { numeral: 'text-2xl', team: 'text-[8px]', photo: 'text-[6px]', gap: 'gap-0.5' },
    md: { numeral: 'text-4xl', team: 'text-[10px]', photo: 'text-[8px]', gap: 'gap-1' },
    lg: { numeral: 'text-6xl', team: 'text-sm', photo: 'text-[10px]', gap: 'gap-1.5' },
    xl: { numeral: 'text-8xl', team: 'text-lg', photo: 'text-xs', gap: 'gap-2' },
  };

  const s = sizes[size];

  const content = (
    <>
      <span className={`font-display font-bold ${s.numeral} text-gold-gradient leading-none`}>
        24
      </span>
      <span
        className={`font-display ${s.team} tracking-[0.25em] uppercase text-foreground leading-none`}
      >
        Moments
      </span>
      <span
        className={`font-accent ${s.photo} tracking-[0.4em] uppercase text-gold leading-none`}
      >
        Photography
      </span>
    </>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className={`flex flex-col ${s.gap} items-center`}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col ${s.gap} items-center`}>
      {content}
    </div>
  );
}
