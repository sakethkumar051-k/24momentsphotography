'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import type { Testimonial } from '@/types/database';

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: '24 Moments captured our wedding with such grace and artistry. Every photograph tells a story we\'ll cherish forever.',
    client_name: 'Priya & Rahul',
    event_type: 'Wedding',
    sort_order: 1,
    created_at: '',
  },
  {
    id: '2',
    quote: 'The team\'s ability to capture split-second moments during our tournament was extraordinary. Pure professionalism.',
    client_name: 'Delhi Sports Club',
    event_type: 'Sports Event',
    sort_order: 2,
    created_at: '',
  },
  {
    id: '3',
    quote: 'Our corporate gala photographs exceeded all expectations. The attention to detail and lighting was impeccable.',
    client_name: 'Anika Sharma, CEO',
    event_type: 'Corporate Event',
    sort_order: 3,
    created_at: '',
  },
  {
    id: '4',
    quote: 'The portrait session felt effortless. They made us feel completely natural, and the results were stunning.',
    client_name: 'The Mehta Family',
    event_type: 'Portrait Session',
    sort_order: 4,
    created_at: '',
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials?featured=true')
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setTestimonials(data) : setTestimonials(defaultTestimonials)))
      .catch(() => setTestimonials(defaultTestimonials))
      .finally(() => setLoading(false));
  }, []);

  const displayTestimonials = testimonials.length ? testimonials : defaultTestimonials;
  const doubled = [...displayTestimonials, ...displayTestimonials];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      if (!isPaused) {
        scrollPos += 0.5;
        if (scrollPos >= container.scrollWidth / 2) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="relative py-32 md:py-40 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading
          label="Testimonials"
          title="Client Stories"
          subtitle="Words from those who trusted us with their precious moments"
        />
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="overflow-hidden"
      >
        <div className="flex gap-6 px-6 w-max">
          {doubled.map((testimonial, i) => (
            <motion.div
              key={`${testimonial.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.1, 0.4) }}
              className="w-[380px] flex-shrink-0 p-8 bg-background border border-border rounded-[3px] relative"
            >
              <span className="absolute top-4 right-6 font-display text-6xl text-gold/10 leading-none select-none">
                &ldquo;
              </span>

              {testimonial.rating != null && testimonial.rating > 0 && (
                <div className="flex gap-0.5 mb-3 text-gold text-sm">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n}>{n <= testimonial.rating! ? '★' : '☆'}</span>
                  ))}
                </div>
              )}

              <p className="text-foreground text-base leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="gold-line mb-4" />

              <div className="flex items-center gap-3">
                {testimonial.client_photo_url ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-border">
                    <Image
                      src={testimonial.client_photo_url}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 font-display text-gold text-lg">
                    {testimonial.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-display text-lg text-foreground">{testimonial.client_name}</p>
                  <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-gold mt-1">
                    {testimonial.event_type}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
