'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const smoothX = useSpring(cursorX, {
    damping: 30,
    stiffness: 250,
    mass: 0.4,
  });
  const smoothY = useSpring(cursorY, {
    damping: 30,
    stiffness: 250,
    mass: 0.4,
  });

  const isMobile = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    isMobile.current = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile.current) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.dataset.cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseDown = () => {
      setIsPressed(true);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  const coreSize = isHovering ? 18 : 10;
  const ringSize = isHovering ? 40 : 24;

  return (
    <>
      {/* Inner gold core */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{
            width: coreSize,
            height: coreSize,
            scale: isPressed ? 0.9 : 1,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="rounded-full bg-gold"
          style={{
            boxShadow: '0 0 22px rgba(212, 160, 23, 0.45), 0 0 50px rgba(212, 160, 23, 0.18)',
          }}
        />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 0.4 : 0,
        }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: ringSize,
            borderWidth: isPressed ? 1.5 : 1,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="rounded-full border border-gold/40"
          style={{
            boxShadow: '0 0 26px rgba(212, 160, 23, 0.2)',
          }}
        />
      </motion.div>
    </>
  );
}

