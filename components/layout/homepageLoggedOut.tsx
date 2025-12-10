'use client';

import { motion } from 'framer-motion';
import { Calendar, Music, Grid3X3, Sparkles } from 'lucide-react';
import type { DailyVibe, Vibe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { format, parseISO } from 'date-fns';

type HomepageLoggedOutProps = {
  previewVibes: DailyVibe[];
  vibes: Vibe[];
};

const features = [
  {
    icon: Calendar,
    title: 'Daily Check-ins',
    description: 'Log your mood every day with a quick vibe check. Build a visual diary of how you feel.',
  },
  {
    icon: Grid3X3,
    title: 'Mood Grid',
    description: 'Watch your emotions form a colorful quilt. Each square represents a day, a feeling, a moment.',
  },
  {
    icon: Music,
    title: 'Spotify Integration',
    description: 'Attach a song to capture the soundtrack of your mood. Music and emotion, together.',
  },
  {
    icon: Sparkles,
    title: 'Express Yourself',
    description: 'Add images, videos, and short messages. Your vibes, your way.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Pick your vibe',
    description: 'Choose from emotions like happy, chill, motivated, melancholy, and more.',
  },
  {
    step: '02',
    title: 'Add context',
    description: 'Write a short message, drop a Spotify link, or upload an image.',
  },
  {
    step: '03',
    title: 'Build your grid',
    description: 'Each check-in becomes a tile in your personal mood mosaic.',
  },
  {
    step: '04',
    title: 'Share your vibes',
    description: 'Make your profile public and let others see your emotional journey.',
  },
];

export default function HomepageLoggedOut({ previewVibes, vibes }: HomepageLoggedOutProps) {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <>
      {/* Features Section */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            Track your feels
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-neutral-800 shadow-sm"
              >
                <feature.icon className="w-8 h-8 mb-4 text-happy-500" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            How it works
          </motion.h2>
          <div className="space-y-12">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="text-4xl font-bold text-neutral-200 dark:text-neutral-700 shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Grid Section */}
      {previewVibes.length > 0 && (
        <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-center mb-4"
            >
              See it in action
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center text-neutral-600 dark:text-neutral-400 mb-12"
            >
              A real vibe grid from the community
            </motion.p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-1 rounded-xl overflow-hidden">
              {previewVibes.slice(0, 8).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative aspect-square overflow-hidden"
                >
                  {entry.media && (
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center scale-105 blur-sm"
                      style={{ backgroundImage: `url(${entry.media})` }}
                    />
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 z-10 mix-blend-multiply",
                      currentTheme === 'light'
                        ? `bg-${entry.vibe.vibe_type.toLowerCase()}-400`
                        : `bg-${entry.vibe.vibe_type.toLowerCase()}-900`
                    )}
                    style={{ opacity: 0.85 }}
                  />
                  <div className={cn(
                    "relative z-20 p-4 h-full flex flex-col justify-between",
                    currentTheme === 'light'
                      ? `text-${entry.vibe.vibe_type.toLowerCase()}-800`
                      : `text-${entry.vibe.vibe_type.toLowerCase()}-500`
                  )}>
                    <div className="text-xs opacity-80 font-medium">
                      {format(parseISO(entry.vibe_date), 'MMM d')}
                    </div>
                    <div>
                      <div className="font-semibold text-sm line-clamp-2">
                        {entry.message}
                      </div>
                      <div className="text-xs opacity-60 mt-1 uppercase tracking-wide">
                        {entry.vibe.vibe_type}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Section */}
      <section className="py-24 px-6 bg-white dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-8"
          >
            Join the vibe
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 mb-12"
          >
            Be part of a community that values emotional expression and self-reflection.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            {['happy', 'chill', 'motivated', 'loved', 'inspired'].map((vibe, index) => (
              <div
                key={vibe}
                className={cn(
                  "w-12 h-12 rounded-lg",
                  currentTheme === 'light' ? `bg-${vibe}-400` : `bg-${vibe}-600`
                )}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
