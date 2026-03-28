'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

/**
 * md/lg/xl: direct height on the image.
 * sm (navbar / admin): the PNG has lots of empty margin — we scale up inside a clipped box
 * so the gold mark reads at a similar visual weight to the nav links.
 */
const heightClass = {
  md: 'h-16 md:h-20',
  lg: 'h-24 sm:h-28 md:h-32',
  xl: 'h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72',
} as const;

function NavLogoImage() {
  return (
    <span className="relative flex h-[3.5rem] w-[10rem] sm:h-16 sm:w-[11rem] md:h-[4.25rem] md:w-[12rem] shrink-0 items-center justify-center overflow-hidden rounded-[2px]">
      <Image
        src="/logo.png"
        alt="Team Moments Photography — stylized 24 with gold lettering"
        width={1024}
        height={1024}
        className="h-[5.5rem] w-[5.5rem] shrink-0 object-contain origin-center scale-[2.35] sm:scale-[2.5] md:scale-[2.65]"
      />
    </span>
  );
}

export default function Logo({ size = 'md', animate = false }: LogoProps) {
  const img =
    size === 'sm' ? (
      <NavLogoImage />
    ) : (
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
