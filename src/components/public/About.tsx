'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface AboutSettings {
  about_paragraph_1: string;
  about_paragraph_2: string;
  about_image: string;
  stat_years_experience: string;
  stat_happy_clients: string;
  stat_photos_delivered: string;
  stat_events_covered: string;
}

export default function About() {
  const [settings, setSettings] = useState<AboutSettings | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!data || data.error) return;
        setSettings({
          about_paragraph_1: data.about_paragraph_1,
          about_paragraph_2: data.about_paragraph_2,
          about_image: data.about_image,
          stat_years_experience: data.stat_years_experience,
          stat_happy_clients: data.stat_happy_clients,
          stat_photos_delivered: data.stat_photos_delivered,
          stat_events_covered: data.stat_events_covered,
        });
      } catch (e) {
        console.error('Failed to load about settings', e);
      }
    };
    load();
  }, []);

  const stats = [
    {
      value: Number(settings?.stat_years_experience ?? 12),
      suffix: '+',
      label: 'Years Experience',
    },
    {
      value: Number(settings?.stat_happy_clients ?? 500),
      suffix: '+',
      label: 'Happy Clients',
    },
    {
      value: Number(settings?.stat_photos_delivered ?? 50000),
      suffix: '+',
      label: 'Photos Delivered',
    },
    {
      value: Number(settings?.stat_events_covered ?? 1000),
      suffix: '+',
      label: 'Events Covered',
    },
  ];

  return (
    <section className="relative py-32 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <SectionHeading label="Our Story" title="Crafting Visual Legacies" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mt-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] bg-surface-light rounded-[3px] overflow-hidden"
          >
            {settings?.about_image ? (
              <Image
                src={settings.about_image}
                alt="24 Moments Photography"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-8xl text-gold/10">24</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <p className="text-muted text-lg leading-relaxed mb-8">
              {settings?.about_paragraph_1 ||
                "At 24 Moments Photography, we believe every frame tells a story. With over a decade of experience capturing life's most precious moments, our team of passionate photographers brings an editorial eye and cinematic sensibility to every project."}
            </p>
            <p className="text-muted text-lg leading-relaxed mb-12">
              {settings?.about_paragraph_2 ||
                'From intimate portraits to grand celebrations, we craft visual narratives that transcend time. Our commitment to excellence has earned the trust of hundreds of clients across the globe, making us a name synonymous with luxury photography.'}
            </p>

            <div className="gold-line mb-12" />

            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-display text-4xl md:text-5xl text-foreground mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <span className="font-accent text-[10px] tracking-[0.2em] uppercase text-muted">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
