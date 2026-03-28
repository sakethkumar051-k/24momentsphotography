'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

/** Heights tuned for a square mark: nav bar is h-20; hero should read clearly at a glance. */
const heightClass = {
  sm: 'h-12 min-h-[48px] sm:h-14 sm:min-h-[56px] max-h-[4.5rem]',
  md: 'h-16 md:h-20',
  lg: 'h-24 sm:h-28 md:h-32',
  xl: 'h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72',
} as const;

export default function Logo({ size = 'md', animate = false }: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="Team Moments Photography — stylized 24 with gold lettering"
      width={1024}
      height={1024}
      className={`${heightClass[size]} w-auto object-contain`}
      priority={size === 'xl'}
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="inline-flex items-center justify-center"
      >
        {img}
      </motion.div>
    );
  }

  return <span className="inline-flex items-center justify-center">{img}</span>;
}
