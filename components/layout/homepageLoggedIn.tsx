'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Profile = {
  id: string;
  handle: string;
  display_name: string | null;
};

type HomepageLoggedInProps = {
  profile: Profile;
};

export default function HomepageLoggedIn({ profile }: HomepageLoggedInProps) {
  return (
    <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-8 rounded-2xl",
            "bg-white dark:bg-neutral-800",
            "border border-neutral-200 dark:border-neutral-700",
            "shadow-sm"
          )}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-inspired-100 dark:bg-inspired-900/30">
              <Sparkles className="w-6 h-6 text-inspired-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Vibe Assistant</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Coming soon</p>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Get personalized suggestions for your next vibe check based on your mood patterns,
            the time of day, and what&apos;s been on your mind lately.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Mood insights', 'Song suggestions', 'Reflection prompts'].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
