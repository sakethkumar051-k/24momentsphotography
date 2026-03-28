'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const sizeConfig = {
  sm: { h: 'h-14', w: 'w-auto' },
  md: { h: 'h-20', w: 'w-auto' },
  lg: { h: 'h-28', w: 'w-auto' },
  xl: { h: 'h-48 sm:h-56 md:h-64 lg:h-72', w: 'w-auto' },
} as const;

export default function Logo({ size = 'md', animate = false }: LogoProps) {
  const { h, w } = sizeConfig[size];

  const img = (
    <Image
      src="/logo.png"
      alt="24 Moments Photography"
      width={512}
      height={512}
      className={`${h} ${w} object-contain`}
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
