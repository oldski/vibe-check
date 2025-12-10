"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "system", icon: Laptop, label: "System" },
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div className="flex w-fit rounded-full border bg-background/50 p-0.5">
      {themes.map(({ value, icon: Icon, label }) => (
        <span key={value} className="h-full">
          <input
            className="peer sr-only"
            type="radio"
            id={`theme-switch-${value}`}
            name="theme-switch"
            value={value}
            checked={theme === value}
            onChange={(e) => setTheme(e.target.value)}
          />
          <label
            htmlFor={`theme-switch-${value}`}
            className="flex size-6 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors peer-checked:bg-accent peer-checked:text-foreground"
            aria-label={`${label} theme`}
          >
            <Icon className="size-4 shrink-0" />
          </label>
        </span>
      ))}
    </div>
  );
};

export { ThemeSwitcher };
