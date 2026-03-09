import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          DEFAULT: "#7c3aed",
        },
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          DEFAULT: "#f59e0b",
        },
        dark: {
          DEFAULT: "#0f0f1a",
          surface: "#1a1a2e",
          card: "#16213e",
          border: "#2d2d5e",
          muted: "#6b7280",
        },
        neon: {
          purple: "#bf00ff",
          blue: "#00d4ff",
          green: "#00ff88",
          pink: "#ff006e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-game": "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
        "gradient-card": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        "gradient-primary": "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #7c3aed, 0 0 10px #7c3aed" },
          "100%": { boxShadow: "0 0 10px #7c3aed, 0 0 30px #7c3aed, 0 0 60px #7c3aed" },
        },
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#d1d5db",
            "--tw-prose-headings": "#f9fafb",
            "--tw-prose-links": "#a78bfa",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
