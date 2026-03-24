"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a placeholder matching the button's size to prevent layout shift
  if (!mounted) {
    return <div className="w-8 h-8" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#7a7268] hover:text-[#1a1714] hover:bg-[#eeebe5] dark:text-[#8a7e6e] dark:hover:text-[#f0ece4] dark:hover:bg-[#2a2620]"
      style={{ transition: "background 180ms var(--ease-smooth), color 180ms var(--ease-smooth)" }}
    >
      {/* Sun icon — shown in dark mode */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.4)",
          transition: "opacity 220ms ease, transform 350ms var(--ease-spring)",
          display: "flex",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </span>

      {/* Moon icon — shown in light mode */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0.4)" : "rotate(0deg) scale(1)",
          transition: "opacity 220ms ease, transform 350ms var(--ease-spring)",
          display: "flex",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
