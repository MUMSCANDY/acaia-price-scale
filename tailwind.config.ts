import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Baloo 2', 'system-ui', 'sans-serif'],
        label: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'lifted': 'var(--shadow-lifted)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'xl': '2rem',
        '2xl': '2.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.85" },
        },
        "breathe-slow": {
          "0%, 100%": { transform: "scale(1) translateX(0)", opacity: "1" },
          "50%": { transform: "scale(1.05) translateX(5px)", opacity: "0.9" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(3deg)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(-2deg)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(-6px) rotate(-2deg)" },
          "50%": { transform: "translateY(6px) rotate(2deg)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "parallax-zoom-slow": {
          "0%, 100%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.15) translate(-2%, 2%)" },
        },
        "parallax-zoom-mid": {
          "0%, 100%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.12) translate(3%, -1%)" },
        },
        "parallax-zoom-fast": {
          "0%, 100%": { transform: "scale(1.05) translate(0, 0)" },
          "50%": { transform: "scale(1.18) translate(-1%, 3%)" },
        },
        "drift-subtle": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(5px, -8px)" },
          "66%": { transform: "translate(-3px, 5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "breathe": "breathe 8s ease-in-out infinite",
        "breathe-slow": "breathe-slow 12s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 5s ease-in-out infinite",
        "float-reverse": "float-reverse 7s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "wiggle": "wiggle 3s ease-in-out infinite",
        "parallax-zoom-slow": "parallax-zoom-slow 60s ease-in-out infinite",
        "parallax-zoom-mid": "parallax-zoom-mid 45s ease-in-out infinite",
        "parallax-zoom-fast": "parallax-zoom-fast 30s ease-in-out infinite",
        "drift-subtle": "drift-subtle 20s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;