'use client';

import { cn } from '@/lib/utils';
import FooterClient from './footerClient';
import { ThemeSwitcher } from '@/components/theme-switcher';

// Use explicit class names to avoid hydration mismatch with dynamic theme detection
const vibeColorClasses = [
  { name: 'happy', light: 'bg-happy-400', dark: 'dark:bg-happy-600' },
  { name: 'chill', light: 'bg-chill-400', dark: 'dark:bg-chill-600' },
  { name: 'motivated', light: 'bg-motivated-400', dark: 'dark:bg-motivated-600' },
  { name: 'loved', light: 'bg-loved-400', dark: 'dark:bg-loved-600' },
  { name: 'inspired', light: 'bg-inspired-400', dark: 'dark:bg-inspired-600' },
];

const Footer = () => {
  return (
    <FooterClient>
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Vibe Check © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {vibeColorClasses.map((vibe) => (
              <div
                key={vibe.name}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  vibe.light,
                  vibe.dark
                )}
              />
            ))}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </FooterClient>
  );
};

export default Footer;
