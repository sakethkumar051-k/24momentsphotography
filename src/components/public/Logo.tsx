'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const sizeConfig = {
  sm: 'h-16 md:h-20',
  md: 'h-24 md:h-28',
  lg: 'h-32 md:h-36',
  xl: 'h-56 sm:h-64 md:h-72 lg:h-80',
} as const;

export default function Logo({ size = 'md', animate = false }: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="24 Moments Photography"
      width={512}
      height={512}
      className={`${sizeConfig[size]} w-auto object-contain`}
      priority={size === 'xl' || size === 'sm'}
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
