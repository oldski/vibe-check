'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import FooterClient from './footerClient';
import { ThemeSwitcher } from '@/components/theme-switcher';

const vibeColors = ['happy', 'chill', 'motivated', 'loved', 'inspired'];

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <FooterClient>
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Vibe Check © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {vibeColors.map((vibe) => (
              <div
                key={vibe}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  currentTheme === 'light' ? `bg-${vibe}-400` : `bg-${vibe}-600`
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
