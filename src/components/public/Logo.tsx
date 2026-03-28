'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const heightClass = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-24 md:h-28 lg:h-32',
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
