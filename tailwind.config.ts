import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-instrument)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0f0e0c",
          2: "#1c1916",
          3: "#252017",
          4: "#2e2a24",
          5: "#3e3830",
        },
        cream: {
          DEFAULT: "#f2ece0",
          2: "#a09282",
          3: "#5a5148",
        },
        gold: {
          DEFAULT: "#d4a853",
          light: "#e0b86a",
          dim: "rgba(212, 168, 83, 0.12)",
        },
        brand: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
          light: "#818CF8",
          dim: "rgba(99, 102, 241, 0.08)",
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "slide-down": "slideDown 0.15s ease forwards",
        "fade-up": "fadeUp 0.5s ease forwards",
        "cursor-blink": "cursorBlink 0.9s step-end infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.4)",
        dropdown: "0 16px 48px rgba(0,0,0,0.6)",
        "gold-glow": "0 0 0 3px rgba(212, 168, 83, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
