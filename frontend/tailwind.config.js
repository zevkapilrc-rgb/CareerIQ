/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Burgundy Brand Palette ── */
        primary: {
          DEFAULT: "#7A1730",
          light: "#b8324f",
          dark: "#4D0014",
          subtle: "#22000C",
          50: "#FDF2F4",
          100: "#FAE5EA",
          200: "#F5CCD6",
          300: "#EDAAB9",
          400: "#E07D95",
          500: "#C4466A",
          600: "#A61F3E",
          700: "#7A1730",
          800: "#5E1226",
          900: "#4D0014",
          950: "#2A000B",
        },
        /* ── Warm Gold/Copper Accent ── */
        accent: {
          DEFAULT: "#C9975A",
          light: "#DEB87E",
          dark: "#A0753F",
          50: "#FBF6EF",
          100: "#F5E8D4",
          200: "#EBCFA8",
          300: "#DEB87E",
          400: "#C8965C",
          500: "#B07A42",
          600: "#A0753F",
          700: "#7E5A30",
          800: "#5D4223",
          900: "#3D2B17",
        },
        /* ── Semantic ── */
        ink: "#0B0B0B",
        parchment: "#FFFFFF",
        "signal-amber": "#7A1730",
        "route-teal": "#7A1730",
        "alert-coral": "#EF4444",
        bg: {
          dark: "#0d0a0c",
          light: "#faf7f5",
        },
        text: {
          dark: "#f5f0f0",
          light: "#1a1414",
        },
        slate: {
          DEFAULT: "#5B6B85",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020817",
        },
      },
      backgroundImage: {
        "cartography-glass":
          "radial-gradient(circle at top, rgba(122, 23, 48, 0.16), transparent 55%), radial-gradient(circle at bottom right, rgba(200, 150, 92, 0.06), transparent 60%), linear-gradient(180deg, #0B0B0B, #050505)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "Fraunces",
          "Georgia",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "IBM Plex Mono",
          "Menlo",
          "monospace",
        ],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 12px 2px rgba(122, 23, 48, 0.15)",
          },
          "50%": {
            boxShadow: "0 0 24px 6px rgba(122, 23, 48, 0.3)",
          },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 150s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        breathe: "breathe 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
